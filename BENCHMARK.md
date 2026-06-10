# Benchmark & Monitoring Rig

A self-contained rig to measure this Next.js app's runtime cost and HTTP
performance under load. Everything lives under `monitoring/`, `scripts/`, an
additive Prisma seed (`prisma/seed.bench.ts`), and one bench-only API route
(`src/app/api/benchmark/route.ts`). The production `docker-compose.yml`,
`Dockerfile`, and app features are untouched.

> **Honesty about the tools.** cAdvisor + Prometheus only see **container
> CPU/RAM/network**. HTTP latency/throughput come from **k6**. Cold start and
> deployment size are **one-shot scripts**. Nothing here profiles app-internal
> timings.

---

## The 6 metrics

| Metric | Source | How |
|---|---|---|
| Cold start | script | `scripts/cold-start.ps1` — recreate `web`, time to first HTTP 200 |
| RAM idle | Prometheus/Grafana | `container_memory_usage_bytes{name="miwl-bench-web"}` at rest |
| Peak CPU | Prometheus | `max_over_time(rate(container_cpu_usage_seconds_total[30s])[<window>:5s])` |
| P95 TTFB | k6 | `http_req_waiting` p(95) (captured per run by `run-phase.ps1`) |
| Max RPS (<500ms) | k6 | highest `RPS` where `http_req_duration` p(95) < 500ms (sweep, below) |
| Deployment size | script | `scripts/image-size.ps1` — built Docker image size |

---

## One-time setup

Requires Docker Desktop (with `docker compose`). From the repo root:

```powershell
# Build the app image + bring up db, app, cAdvisor, Prometheus, Grafana.
# Runs migrations and seeds the admin + benchmark fixtures automatically.
docker compose -f monitoring/docker-compose.monitoring.yml up -d --build
```

Endpoints once up:

| Service | URL |
|---|---|
| App under test | http://localhost:3000 |
| Grafana (admin/admin) | http://localhost:3001 → dashboard **MIWL Benchmark** |
| Prometheus | http://localhost:9090 |
| cAdvisor | http://localhost:8080 |

The app container is **`miwl-bench-web`** (cAdvisor labels metrics by this `name`).
CPU is capped at **0.90 cores** in the compose `web.deploy.resources.limits` so
peak-CPU and max-RPS are reproducible — adjust there if you want a different
budget.

Seeded benchmark account (role `USER`): `bench@makeitwithlove.com` / `Bench@12345`.

---

## ⚠️ Smoke-test the fragile part first (hard-phase auth)

The most fragile piece is the **NextAuth credentials login** in the hard phase
(`monitoring/k6/lib/auth.js`): CSRF fetch → credentials callback → reuse the
`authjs.session-token` cookie. Verify it end-to-end with a single iteration
before any real run:

```powershell
docker compose -f monitoring/docker-compose.monitoring.yml run --rm `
  -e MODE=smoke -e VUS=1 -e ITERATIONS=1 k6 run /scripts/hard.js
```

Expect all checks (`home 200`, `create 201`, `read/update/delete 200`) to pass
and the digest line to show `fail=0.00%`. If `create` returns 401, login failed —
check `AUTH_SECRET`/`AUTH_TRUST_HOST` on `web` and that `ENABLE_BENCHMARK_API=1`.

---

## Capturing each metric

### Cold start
```powershell
./scripts/cold-start.ps1
```

### Deployment size
```powershell
./scripts/image-size.ps1
```

### RAM idle
Let the stack sit idle ~1 min, then read the **RAM idle (current)** stat in
Grafana, or query Prometheus directly:
```
container_memory_usage_bytes{name="miwl-bench-web"}
```

### P95 TTFB, Peak CPU, Peak RAM (per phase, averaged)
`run-phase.ps1` runs a phase N times, parses each k6 summary, queries Prometheus
for that run's peak CPU/RAM, appends `monitoring/results/<phase>-runs.csv`, and
prints averages:

```powershell
./scripts/run-phase.ps1 -Phase light  -Runs 10 -Rps 50 -Duration 30s
./scripts/run-phase.ps1 -Phase medium -Runs 10 -Rps 20 -Duration 30s
./scripts/run-phase.ps1 -Phase hard   -Runs 10 -Rps 20 -Duration 30s
```

### Max RPS (<500ms) — the sweep
There's no single command; sweep `RPS` upward and take the **highest** value
where P95 `http_req_duration` stays < 500ms. Each step writes a CSV row:

```powershell
foreach ($r in 10,25,50,75,100,150,200) {
  ./scripts/run-phase.ps1 -Phase light -Runs 3 -Rps $r -Duration 30s
}
```
Inspect `monitoring/results/light-runs.csv` and read off the last `rps` whose
`dur_p95_ms` < 500. Repeat per phase (medium/hard saturate at lower RPS).

---

## Phase definitions

| Phase | Target | What it does |
|---|---|---|
| **light** | `GET /privacy` | Static page, no auth, no DB. |
| **medium** | `GET /` + images | Image-heavy home page; parses the HTML and fetches every referenced image, incl. Next's `/_next/image` optimized URLs. |
| **hard** | login + `/` + CRUD | NextAuth login once, browse home, then `POST→GET→PUT→DELETE /api/benchmark` (self-cleaning) on every iteration. |

k6 modes (env `MODE`):
- `rps` — `constant-arrival-rate` (the real benchmark); env `RPS`, `DURATION`.
- `smoke` — `per-vu-iterations`; env `VUS`, `ITERATIONS`.

Every script always attaches `http_req_duration: p(95)<500` as a threshold
(non-aborting, so the run still completes and reports when it breaches).

---

## Useful PromQL

```promql
# RAM idle / usage
container_memory_usage_bytes{name="miwl-bench-web"}

# CPU cores in use (instantaneous rate)
rate(container_cpu_usage_seconds_total{name="miwl-bench-web"}[1m])

# Peak CPU over the last 5 minutes
max_over_time(rate(container_cpu_usage_seconds_total{name="miwl-bench-web"}[30s])[5m:5s])

# Peak RAM over the last 5 minutes
max_over_time(container_memory_usage_bytes{name="miwl-bench-web"}[5m])

# Network throughput
rate(container_network_receive_bytes_total{name="miwl-bench-web"}[1m])
rate(container_network_transmit_bytes_total{name="miwl-bench-web"}[1m])
```

---

## Results template

Fill in after running each phase 10× and averaging (numbers come straight from
the CSVs + the one-shot scripts):

| Metric | light | medium | hard |
|---|---|---|---|
| Cold start (s) | — | — | — |
| RAM idle (MB) | — | — | — |
| Peak CPU (cores) | | | |
| P95 TTFB (ms) | | | |
| Max RPS (<500ms) | | | |
| Deployment size (MB) | — | — | — |

(Cold start, RAM idle, and deployment size are app-wide one-shots, not per-phase.)

---

## Teardown

```powershell
# Stop everything and remove the bench volumes (Postgres data, Grafana, Prometheus).
docker compose -f monitoring/docker-compose.monitoring.yml down -v

# Optionally drop the built image.
docker image rm miwl-bench:latest
```

Results CSVs in `monitoring/results/` are gitignored; delete the folder contents
to reset.
