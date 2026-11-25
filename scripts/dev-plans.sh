#!/usr/bin/env bash
# Start A/B/C plan previews side by side for the floating plan switcher.
#   A = main (3001)   B = homepage-v2-planB (3002)   C = homepage-v2-planC (3003)
# Each branch runs from its own git worktree; node_modules is shared via symlink.
# Usage: scripts/dev-plans.sh        (Ctrl+C stops all servers)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PARENT="$(dirname "$ROOT")"
cd "$ROOT"

# plan | branch | port | directory
PLANS=(
  "A|main|3001|$PARENT/octen-homepage-main-preview"
  "B|homepage-v2-planB|3002|$ROOT"
  "C|homepage-v2-planC|3003|$PARENT/octen-homepage-planC-preview"
)

PIDS=()
trap 'kill "${PIDS[@]}" 2>/dev/null || true' EXIT INT TERM

for entry in "${PLANS[@]}"; do
  IFS='|' read -r plan branch port dir <<<"$entry"
  if [ ! -d "$dir" ]; then
    git worktree add "$dir" "$branch"
  fi
  if [ "$dir" != "$ROOT" ] && [ ! -e "$dir/node_modules" ]; then
    ln -s "$ROOT/node_modules" "$dir/node_modules"
  fi
  if lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Plan $plan: port $port already in use, skipping start"
    continue
  fi
  echo "Plan $plan ($branch) -> http://localhost:$port/"
  (cd "$dir" && exec "$ROOT/node_modules/.bin/vite" --port "$port" --strictPort) &
  PIDS+=($!)
done

wait
