#!/usr/bin/env bash
# Report the built app image size (deployment size).
# Usage: scripts/image-size.sh [IMAGE]
set -euo pipefail

IMAGE="${1:-miwl-bench:latest}"

bytes=$(docker image inspect "$IMAGE" --format '{{.Size}}' 2>/dev/null || true)
if [ -z "$bytes" ]; then
  echo "Image '$IMAGE' not found. Build it first:" >&2
  echo "  docker compose -f monitoring/docker-compose.monitoring.yml build web" >&2
  exit 1
fi
mb=$(awk -v b="$bytes" 'BEGIN { printf "%.1f", b/1048576 }')
echo "Docker image '$IMAGE': ${mb} MB"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ -d "$REPO_ROOT/.next" ]; then
  next_kb=$(du -sk "$REPO_ROOT/.next" | cut -f1)
  echo ".next build output : $(awk -v k="$next_kb" 'BEGIN { printf "%.1f", k/1024 }') MB"
fi
