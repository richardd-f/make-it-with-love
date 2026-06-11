#!/usr/bin/env bash
# Run one benchmark phase N times, collect k6 + Prometheus metrics, append a CSV
# and print averages.  Linux/macOS equivalent of run-phase.ps1.
#
# Prerequisites: docker compose stack already up, curl, awk (standard on Linux).
#
# Usage:
#   scripts/run-phase.sh light  [RUNS] [RPS] [DURATION]
#   scripts/run-phase.sh medium 10     20    30s
#   scripts/run-phase.sh hard   10     20    30s
#
# The script queries Prometheus at http://localhost:9090 (or $PROMETHEUS_URL).
set -euo pipefail

PHASE="${1:-light}"
RUNS="${2:-10}"
RPS="${3:-50}"
DURATION="${4:-30s}"
MODE="${MODE:-rps}"
APP_CONTAINER="${APP_CONTAINER:-miwl-bench-web}"
PROM_URL="${PROMETHEUS_URL:-http://localhost:9090}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE="$REPO_ROOT/monitoring/docker-compose.monitoring.yml"
RESULTS_DIR="$REPO_ROOT/monitoring/results"
SUMMARY_FILE="$RESULTS_DIR/$PHASE-summary.json"
CSV_FILE="$RESULTS_DIR/$PHASE-runs.csv"

mkdir -p "$RESULTS_DIR"

# URL-encode a string using awk (no python3/php dependency).
urlencode() {
  echo "$1" | awk '
  BEGIN { for (i=0; i<256; i++) ord[sprintf("%c",i)] = i }
  {
    out = ""
    n = split($0, chars, "")
    for (i=1; i<=n; i++) {
      c = chars[i]
      if (c ~ /[A-Za-z0-9._~-]/) {
        out = out c
      } else {
        out = out sprintf("%%%02X", ord[c])
      }
    }
    print out
  }'
}

# Query Prometheus for a scalar value at a given Unix timestamp.
prom_scalar() {
  local query="$1" at="$2"
  local encoded resp
  encoded=$(urlencode "$query")
  resp=$(curl -sf "$PROM_URL/api/v1/query?query=$encoded&time=$at" 2>/dev/null || true)
  [ -z "$resp" ] && echo "nan" && return
  echo "$resp" | awk '
    BEGIN { val = "nan" }
    match($0, /"value":\[[^,]+,\"([^\"]+)\"/, arr) { val = arr[1] }
    END { print val }
  '
}

# Read a numeric value out of the k6 summary JSON using awk.
# Keys passed as dot-separated path, e.g. "http_req_waiting p(95)".
json_scalar() {
  local key="$1"
  awk -v key="$key" '
    { line = line $0 }
    END {
      val = "nan"
      # Match "key": <number>  (handles quoted keys with special chars like parens)
      pattern = "\"" key "\"[[:space:]]*:[[:space:]]*([0-9]+\\.?[0-9]*)"
      if (match(line, pattern, arr)) val = arr[1]
      print val
    }
  ' "$SUMMARY_FILE" 2>/dev/null || echo "nan"
}

echo "== Phase '$PHASE' x$RUNS (mode=$MODE rps=$RPS duration=$DURATION) =="

ttfbs=(); durs=(); cpus=(); rams=(); run_count=0

for ((i=1; i<=RUNS; i++)); do
  start=$(date +%s)

  docker compose -f "$COMPOSE" run --rm \
    -e "MODE=$MODE" -e "RPS=$RPS" -e "DURATION=$DURATION" \
    k6 run "/scripts/$PHASE.js"

  end=$(date +%s)
  window=$(( end - start < 30 ? 30 : end - start ))

  if [ ! -f "$SUMMARY_FILE" ]; then
    echo "WARNING: run $i: no summary at $SUMMARY_FILE - skipping." >&2
    continue
  fi

  ttfb=$(json_scalar 'p(95)')
  dur=$(json_scalar 'p(95)')
  reqs=$(json_scalar 'count')
  fail=$(json_scalar 'rate')

  cpu_q="max_over_time(rate(container_cpu_usage_seconds_total{name=\"$APP_CONTAINER\"}[30s])[${window}s:5s])"
  ram_q="max_over_time(container_memory_usage_bytes{name=\"$APP_CONTAINER\"}[${window}s])"
  peak_cpu=$(prom_scalar "$cpu_q" "$end")
  peak_ram=$(prom_scalar "$ram_q" "$end")

  if [ ! -f "$CSV_FILE" ]; then
    echo "timestamp,run,phase,mode,rps,duration,reqs,ttfb_p95_ms,dur_p95_ms,fail_pct,peak_cpu_cores,peak_ram_bytes" > "$CSV_FILE"
  fi
  ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  fail_pct=$(awk -v f="$fail" 'BEGIN { printf "%.2f", f * 100 }')
  echo "$ts,$i,$PHASE,$MODE,$RPS,$DURATION,$reqs,$ttfb,$dur,$fail_pct,$peak_cpu,$peak_ram" >> "$CSV_FILE"

  echo "run $i: ttfb_p95=${ttfb}ms dur_p95=${dur}ms peakCPU=$peak_cpu peakRAM=${peak_ram}B"
  ttfbs+=("$ttfb"); durs+=("$dur")
  [ "$peak_cpu" != "nan" ] && cpus+=("$peak_cpu")
  [ "$peak_ram" != "nan" ] && rams+=("$peak_ram")
  ((run_count++)) || true
done

# Average an array of numbers, skipping "nan" values.
avg() {
  printf '%s\n' "$@" | awk '
    $1 != "nan" { sum += $1; n++ }
    END { if (n > 0) printf "%.2f\n", sum/n; else print "n/a" }
  '
}

echo ""
echo "== Averages over $run_count runs =="
echo "P95 TTFB       : $(avg "${ttfbs[@]:-nan}") ms"
echo "P95 duration   : $(avg "${durs[@]:-nan}") ms"
echo "Peak CPU       : $(avg "${cpus[@]:-nan}") cores"
ram_avg=$(avg "${rams[@]:-nan}")
if [ "$ram_avg" != "n/a" ]; then
  ram_mb=$(awk -v r="$ram_avg" 'BEGIN { printf "%.1f", r/1048576 }')
  echo "Peak RAM       : ${ram_mb} MB"
fi
echo "CSV: $CSV_FILE"
