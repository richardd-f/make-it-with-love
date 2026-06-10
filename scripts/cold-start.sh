#!/usr/bin/env bash
# Measure cold start: recreate the app container and time to first HTTP 200.
# Usage: scripts/cold-start.sh [URL] [TIMEOUT_SEC]
set -euo pipefail

SERVICE="${SERVICE:-web}"
URL="${1:-http://localhost:3000/}"
TIMEOUT="${2:-120}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE="$REPO_ROOT/monitoring/docker-compose.monitoring.yml"

echo "Recreating '$SERVICE' and timing first HTTP 200 at $URL ..."
docker compose -f "$COMPOSE" up -d --force-recreate --no-deps "$SERVICE"

start=$(date +%s.%N)
deadline=$(echo "$start + $TIMEOUT" | bc)
ready=0
while (( $(echo "$(date +%s.%N) < $deadline" | bc -l) )); do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "$URL" || true)
  if [ "$code" = "200" ]; then ready=1; break; fi
  sleep 0.25
done
end=$(date +%s.%N)
elapsed=$(echo "$end - $start" | bc)

if [ "$ready" = "1" ]; then
  printf 'Cold start: %.2f s\n' "$elapsed"
else
  echo "Did not reach HTTP 200 within ${TIMEOUT}s" >&2
  exit 1
fi
