#!/usr/bin/env bash
# Run one benchmark phase N times, collect k6 + Prometheus metrics, append a CSV
# and print averages.  Linux/macOS equivalent of run-phase.ps1.
#
# Prerequisites: docker compose stack already up, curl, python3 or bc (for math).
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

prom_scalar() {
  local query="$1" at="$2"
  local encoded
  encoded=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$query" 2>/dev/null || \
            php -r "echo urlencode(\$argv[1]);" "$query" 2>/dev/null || \
            echo "$query" | sed 's/ /%20/g;s/\[/%5B/g;s/\]/%5D/g;s/{/%7B/g;s/}/%7D/g;s/"/%22/g;s/=/%3D/g;s/,/%2C/g')
  local resp
  resp=$(curl -sf "$PROM_URL/api/v1/query?query=$encoded&time=$at" 2>/dev/null || true)
  python3 -c "
import sys,json
d=json.loads(sys.argv[1])
r=d.get('data',{}).get('result',[])
print(r[0]['value'][1] if r else 'nan')
" "$resp" 2>/dev/null || echo "nan"
}

json_val() {
  python3 -c "import sys,json; d=json.load(open(sys.argv[1])); print(eval('d' + sys.argv[2]))" \
    "$SUMMARY_FILE" "$1" 2>/dev/null || echo "nan"
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

  ttfb=$(json_val "['metrics']['http_req_waiting']['values']['p(95)']")
  dur=$(json_val "['metrics']['http_req_duration']['values']['p(95)']")
  reqs=$(json_val "['metrics']['http_reqs']['values']['count']")
  fail=$(json_val "['metrics']['http_req_failed']['values']['rate']" || echo "0")

  cpu_q="max_over_time(rate(container_cpu_usage_seconds_total{name=\"$APP_CONTAINER\"}[30s])[${window}s:5s])"
  ram_q="max_over_time(container_memory_usage_bytes{name=\"$APP_CONTAINER\"}[${window}s])"
  peak_cpu=$(prom_scalar "$cpu_q" "$end")
  peak_ram=$(prom_scalar "$ram_q" "$end")

  if [ ! -f "$CSV_FILE" ]; then
    echo "timestamp,run,phase,mode,rps,duration,reqs,ttfb_p95_ms,dur_p95_ms,fail_pct,peak_cpu_cores,peak_ram_bytes" > "$CSV_FILE"
  fi
  ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  fail_pct=$(python3 -c "print(round(float('$fail')*100,2))" 2>/dev/null || echo "$fail")
  echo "$ts,$i,$PHASE,$MODE,$RPS,$DURATION,$reqs,$ttfb,$dur,$fail_pct,$peak_cpu,$peak_ram" >> "$CSV_FILE"

  echo "run $i: ttfb_p95=${ttfb}ms dur_p95=${dur}ms peakCPU=$peak_cpu peakRAM=${peak_ram}B"
  ttfbs+=("$ttfb"); durs+=("$dur")
  [ "$peak_cpu" != "nan" ] && cpus+=("$peak_cpu")
  [ "$peak_ram" != "nan" ] && rams+=("$peak_ram")
  ((run_count++)) || true
done

avg() {
  python3 -c "
vals=[float(x) for x in '$*'.split() if x != 'nan']
print(round(sum(vals)/len(vals),2) if vals else 'n/a')
" 2>/dev/null || echo "n/a"
}

echo ""
echo "== Averages over $run_count runs =="
echo "P95 TTFB       : $(avg "${ttfbs[@]:-nan}") ms"
echo "P95 duration   : $(avg "${durs[@]:-nan}") ms"
echo "Peak CPU       : $(avg "${cpus[@]:-nan}") cores"
ram_avg=$(avg "${rams[@]:-nan}")
if [ "$ram_avg" != "n/a" ]; then
  ram_mb=$(python3 -c "print(round(float('$ram_avg')/1048576,1))" 2>/dev/null || echo "$ram_avg")
  echo "Peak RAM       : ${ram_mb} MB"
fi
echo "CSV: $CSV_FILE"
