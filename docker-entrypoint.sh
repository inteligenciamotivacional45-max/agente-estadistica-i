#!/bin/sh
set -eu

EVE_PORT="${EVE_NEXT_PRODUCTION_PORT:-4274}"
NEXT_PORT="${NEXT_PORT:-${PORT:-3000}}"

# El chat en este VPS necesita eve start en 4274 y next start en 3000.
PORT="$EVE_PORT" npx eve start --host 127.0.0.1 &

i=0
while [ "$i" -lt 90 ]; do
  if node -e "fetch('http://127.0.0.1:${EVE_PORT}/eve/v1/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"; then
    break
  fi
  i=$((i + 1))
  sleep 1
done

if [ "$i" -ge 90 ]; then
  echo "eve start did not become ready on port ${EVE_PORT}" >&2
  exit 1
fi

exec npx next start -H "${HOSTNAME:-0.0.0.0}" -p "$NEXT_PORT"
