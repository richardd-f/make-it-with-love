# Task: Add a container-monitoring + load-benchmark rig to this Next.js app

Build a self-contained monitoring/benchmark setup so I can measure this Next.js
website's performance across three load phases. This mirrors a rig I already built
for a sibling Laravel project — reuse the same architecture and conventions, but
adapt every detail to THIS repo by inspecting it first. Do not assume framework
conventions; read the actual code.

## Before writing anything
1. Explore the repo: how the app is built and served (`next start`, standalone
   output, custom server?), the routing model (App Router vs Pages Router),
   whether there's already a `Dockerfile` / `docker-compose.yml`, the auth
   mechanism (NextAuth? JWT? session cookie? CSRF?), and which routes exist for
   static pages, image-heavy pages, and CRUD (API route handlers / server actions).
2. Check for seed data / a test user I can authenticate as for the CRUD phase.
   If none exists, tell me and propose the minimal seed.
3. Write a short PRD (problem / success criteria / scope / constraints / plan /
   open questions) and WAIT for my sign-off before implementing. Flag anything
   that can't be measured by the chosen tools.

## What the rig must measure (6 metrics)
Be honest: cAdvisor + Prometheus only see **container CPU/RAM**. HTTP metrics come
from **k6**; cold start and image size are one-shot scripts.

| Metric | Source | How |
|---|---|---|
| Cold start | script | recreate the app container, time to first HTTP 200 |
| RAM idle | Prometheus/Grafana | `container_memory_usage_bytes` at rest |
| Peak CPU | Prometheus | `max_over_time(rate(container_cpu_usage_seconds_total[…]))` over the run |
| P95 TTFB | k6 | `http_req_waiting` p(95) |
| Max RPS (<500ms) | k6 | highest target RPS where `http_req_duration` p(95) stays < 500ms |
| Deployment size | script | built Docker image size (and/or `.next` build output size) |

## Test plan (I will run this)
Three phases, each run **10×** and averaged:
- **light** — request a static page only (no auth, no data).
- **medium** — request an image-heavy page and fetch all the images it references
  (note: Next.js may serve optimized images via `/_next/image` — fetch those too).
- **hard** — authenticate, browse the image-heavy page, then do a full CRUD cycle
  against the real API (create → read → update → delete, self-cleaning so it's
  repeatable). Handle whatever auth/CSRF this app actually uses.

## Deliverables (match this structure/spirit)
- `monitoring/docker-compose.monitoring.yml` — **separate** from the app's compose
  so prod isn't forced to run it; services: **cAdvisor**, **Prometheus**,
  **Grafana** (auto-provisioned datasource + a dashboard with RAM-idle/peak-CPU/
  network panels), and an on-demand **k6** service (don't auto-start it; use a
  compose `profile`). Put services on the same Docker network as the app so
  Prometheus can scrape cAdvisor and k6 can reach the app container by name.
  - The app MUST run as a container for cAdvisor to see it. If there's no
    Dockerfile, create one (use Next.js `output: "standalone"` for a small image).
- `monitoring/prometheus/prometheus.yml` — scrape cAdvisor + self; enable
  `--web.enable-remote-write-receiver`.
- `monitoring/grafana/...` — provisioning + dashboard JSON.
- `monitoring/k6/light.js | medium.js | hard.js` + a shared `lib/` with:
  - an env-driven options builder: **RPS mode** (`constant-arrival-rate`, env
    `RPS`/`DURATION`) for the real benchmark, plus an iteration smoke mode; always
    attach a `http_req_duration: p(95)<500` threshold.
  - a `handleSummary` that prints a one-line digest and writes the full metrics
    JSON to `/results/<phase>-summary.json` (don't append in handleSummary — the
    runner parses the JSON and appends the CSV).
  - auth + token helpers appropriate to THIS app's login flow.
- `scripts/cold-start.*`, `scripts/image-size.*`, and `scripts/run-phase.ps1`
  (PowerShell-primary — I'm on Windows 11; add `.sh` equivalents for the simple
  ones). `run-phase` must: run a phase N times, parse each k6 summary JSON, query
  Prometheus for per-run peak CPU and peak RAM, append
  `monitoring/results/<phase>-runs.csv`, and print averages. Gitignore the results.
- `BENCHMARK.md` — metric→command table, one-time setup, how to capture each
  metric, the RPS-sweep method for "Max RPS <500ms", phase definitions, useful
  PromQL, a results template table, and teardown.

## Conventions
- Don't modify app code beyond what's needed to containerize/seed; keep monitoring
  isolated.
- Validate before claiming done: `docker compose config -q` on the monitoring file,
  syntax-check the k6 scripts and PowerShell scripts.
- Commit on a new branch (`feat/monitoring-rig`) using Conventional Commits; stage
  files by name, not `git add -A`. Don't push without my OK.
- Call out the most fragile part (almost certainly the hard-phase auth/CSRF flow)
  and give me the exact one-run command to smoke-test it first.