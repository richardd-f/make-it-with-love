# Benchmark & Monitoring Rig

A self-contained rig to measure this Next.js app's runtime cost and HTTP
performance under load. Everything lives under `monitoring/`, `scripts/`, an
additive Prisma seed (`prisma/seed.bench.ts`), and one bench-only API route
(`src/app/api/benchmark/route.ts`). The production `docker-compose.yml`,
`Dockerfile`, and app features are untouched.

> **Honesty about the tools.** cAdvisor + Prometheus only see **container
> CPU/RAM/network**. HTTP latency/throughput come from **k6**. Cold start and
> deployment size are one-shot scripts. Nothing here profiles app-internal timings.

---

## The 6 metrics

| Metric | Source | How |
|---|---|---|
| Cold start | script | recreate `web`, time to first HTTP 200, average of 10 |
| RAM idle | Prometheus/Grafana | `container_memory_usage_bytes` at rest |
| Peak CPU | Prometheus | `max_over_time(rate(container_cpu_usage_seconds_total[30s])[…])` |
| P95 TTFB | k6 | `http_req_waiting` p(95), average of 10 runs |
| Max RPS (<500ms) | k6 | highest RPS where `http_req_duration` p(95) < 500ms |
| Deployment size | script | built Docker image size |

---

## One-time setup

```bash
# On the VPS — build the app image, start db, app, cAdvisor, Prometheus, Grafana.
# Runs migrations and seeds the admin + benchmark fixtures automatically.
docker compose -f monitoring/docker-compose.monitoring.yml up -d --build
```

All ports are localhost-only. Open an SSH tunnel from your local machine to
access Grafana and Prometheus:

```bash
ssh -L 3001:localhost:3001 -L 9090:localhost:9090 deployer@your-vps-ip
```

| Service | URL (via tunnel) |
|---|---|
| App under test | http://localhost:3000 (VPS-local only) |
| Grafana (admin / admin) | http://localhost:3001 → **MIWL Benchmark** dashboard |
| Prometheus | http://localhost:9090 |
| cAdvisor | http://localhost:8080 |

Seeded benchmark account: `bench@makeitwithlove.com` / `Bench@12345`

---

## ⚠️ Smoke-test the hard-phase auth first

The most fragile part is the NextAuth credentials login in the hard phase.
Verify it before running any real tests:

```bash
docker compose -f monitoring/docker-compose.monitoring.yml run --rm \
  -e MODE=iterations -e VUS=1 -e ITERATIONS=1 \
  k6 run /scripts/hard.js
```

All 5 checks must pass (`home 200`, `create 201`, `read 200`, `update 200`,
`delete 200`) with `errors: 0.00%`. If `create` returns 401, the login flow
failed — check `AUTH_SECRET` and `ENABLE_BENCHMARK_API=1` on the `web` service.

---

## Step-by-step run guide

Run all steps from the repo root on the VPS
(`/home/deployer/make-it-with-love`). Keep the SSH tunnel open so Grafana is
visible in your browser during the CPU steps.

---

### Step 1 — Deployment size

```bash
bash scripts/image-size.sh
```

→ Write down the **`Docker image 'miwl-bench:latest': X MB`** value.

---

### Step 2 — RAM idle (app at rest, no load)

Open Grafana in your browser: `http://localhost:3001` (admin / admin)
→ **MIWL Benchmark** dashboard → **"RAM idle (current)"** stat panel.

Let the stack sit idle for ~1 minute with no k6 running.

→ Write down the **MB value** shown for `miwl-bench-web`.

---

### Step 3 — Cold start (10 runs, then average)

```bash
chmod +x scripts/cold-start.sh

for i in $(seq 1 10); do
  echo "=== Cold start $i/10 ==="
  bash scripts/cold-start.sh
done
```

→ Write down the seconds printed after each run, then **average the 10 values**.

---

## Light phase

*Repeated GET / requests — the landing page, no auth, no image fetching.*

---

### Step 4 — Find Max RPS (<500ms)

Run one at a time, going higher until it fails. Look for `PASS<500` or `FAIL` in
the `P95 duration` line of the output.

```bash
# Start at 10
docker compose -f monitoring/docker-compose.monitoring.yml run --rm \
  -e MODE=rps -e RPS=10 -e DURATION=30s \
  k6 run /scripts/light.js
```

```
P95 duration : 91ms  (PASS<500)   ← try higher
P95 duration : 612ms  (FAIL …)    ← too high, step back
```

Sweep: **10 → 20 → 50 → 100 → narrow down**.

→ Write down the **highest RPS that still shows `PASS<500`**.

---

### Step 5 — Run light 10 times for P95 TTFB average

```bash
for i in $(seq 1 10); do
  echo "=== Light run $i/10 ==="
  docker compose -f monitoring/docker-compose.monitoring.yml run --rm \
    -e MODE=iterations -e VUS=10 -e ITERATIONS=10 \
    k6 run /scripts/light.js 2>&1 | grep -E "achieved RPS|P95 TTFB|P95 duration"
done
```

→ Write down the **`P95 TTFB`** value from each run, then **average the 10 numbers**.

---

### Step 6 — Peak CPU during light test

Watch Grafana → **"CPU usage"** time-series panel **while step 5 is running**.

→ Write down the **highest CPU (cores) value** you see.

---

## Medium phase

*GET / + batch-fetch every image in the HTML — simulates a real browser page load.*

---

### Step 7 — Find Max RPS (<500ms)

```bash
# Start at 5
docker compose -f monitoring/docker-compose.monitoring.yml run --rm \
  -e MODE=rps -e RPS=5 -e DURATION=30s \
  k6 run /scripts/medium.js
```

Sweep: **5 → 10 → 20 → 50 → narrow down**.

→ Write down the **highest RPS that still shows `PASS<500`**.

---

### Step 8 — Run medium 10 times for P95 TTFB average

```bash
for i in $(seq 1 10); do
  echo "=== Medium run $i/10 ==="
  docker compose -f monitoring/docker-compose.monitoring.yml run --rm \
    -e MODE=iterations -e VUS=5 -e ITERATIONS=5 \
    k6 run /scripts/medium.js 2>&1 | grep -E "achieved RPS|P95 TTFB|P95 duration"
done
```

→ Write down **`P95 TTFB`** from each run, then **average the 10 numbers**.

---

### Step 9 — Peak CPU during medium test

Watch Grafana → **"CPU usage"** panel **while step 8 is running**.

→ Write down the **highest CPU (cores) value** you see.

---

## Hard phase

*Login + browse home + full CRUD cycle (Create → Read → Update → Delete).
Each iteration is self-cleaning. Target RPS is low — each VU does ~6 sequential
requests per iteration.*

---

### Step 10 — Find Max RPS (<500ms)

```bash
# Start at 1 (hard phase is slow: login + 5 HTTP requests per iteration)
docker compose -f monitoring/docker-compose.monitoring.yml run --rm \
  -e MODE=rps -e RPS=1 -e DURATION=30s \
  k6 run /scripts/hard.js
```

Sweep: **1 → 2 → 3 → 5 → narrow down**.

→ Write down the **highest RPS that still shows `PASS<500`**.

---

### Step 11 — Run hard 10 times for P95 TTFB average

```bash
for i in $(seq 1 10); do
  echo "=== Hard run $i/10 ==="
  docker compose -f monitoring/docker-compose.monitoring.yml run --rm \
    -e MODE=iterations -e VUS=5 -e ITERATIONS=5 \
    k6 run /scripts/hard.js 2>&1 | grep -E "achieved RPS|P95 TTFB|P95 duration"
done
```

→ Write down **`P95 TTFB`** from each run, then **average the 10 numbers**.

---

### Step 12 — Peak CPU during hard test

Watch Grafana → **"CPU usage"** panel **while step 11 is running**.

→ Write down the **highest CPU (cores) value** you see.

---

## Results table

Fill in after completing all 12 steps:

| Metric | Value |
|---|---|
| Deployment size (MB) | |
| RAM idle (MB) | |
| Cold start avg (s) | |
| Light — Max RPS (<500ms) | |
| Light — P95 TTFB avg (ms) | |
| Light — Peak CPU (cores) | |
| Medium — Max RPS (<500ms) | |
| Medium — P95 TTFB avg (ms) | |
| Medium — Peak CPU (cores) | |
| Hard — Max RPS (<500ms) | |
| Hard — P95 TTFB avg (ms) | |
| Hard — Peak CPU (cores) | |

---

## Phase definitions

| Phase | Target | What it does |
|---|---|---|
| **light** | `GET /` | Landing page, no auth, no image fetching. |
| **medium** | `GET /` + images | Same page; parses HTML and batch-fetches every image URL found (incl. `/_next/image` optimized URLs). |
| **hard** | login + `GET /` + CRUD | NextAuth credentials login (once per VU), browse home, then `POST→GET→PUT→DELETE /api/benchmark` — self-cleaning. |

k6 modes (env `MODE`):
- `rps` — `constant-arrival-rate`; env `RPS`, `DURATION`. Used for Max RPS sweep.
- `iterations` — `per-vu-iterations` (default); env `VUS`, `ITERATIONS`. Used for P95 TTFB average.

VUs are hard-capped at **10** in both modes to prevent k6 from starving the app.

---

## Resource limits

| Service | CPU limit | RAM limit |
|---|---|---|
| web (app) | 0.90 cores | — |
| cAdvisor | 0.20 cores | 128 MB |
| Prometheus | 0.30 cores | 256 MB |
| Grafana | 0.20 cores | 128 MB |
| k6 | 0.50 cores | 256 MB |
| k6 VUs | hard cap 10 | — |

---

## Useful PromQL

```promql
# RAM idle / usage
container_memory_usage_bytes{name="miwl-bench-web"}

# CPU cores in use (instantaneous)
rate(container_cpu_usage_seconds_total{name="miwl-bench-web"}[1m])

# Peak CPU over the last 5 minutes
max_over_time(rate(container_cpu_usage_seconds_total{name="miwl-bench-web"}[30s])[5m:5s])

# Peak RAM over the last 5 minutes
max_over_time(container_memory_usage_bytes{name="miwl-bench-web"}[5m])
```

---

## Teardown

```bash
# Stop everything and remove bench volumes (Postgres data, Grafana, Prometheus).
docker compose -f monitoring/docker-compose.monitoring.yml down -v

# Optionally remove the built image.
docker image rm miwl-bench:latest
```

Results CSVs in `monitoring/results/` are gitignored; delete the folder to reset.
