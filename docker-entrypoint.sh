#!/bin/sh
set -eu

# next start sirve el runtime compilado de Eve (.output) en EVE_NEXT_PRODUCTION_PORT
# y hace proxy de /eve/* hacia ese proceso.
exec node ./node_modules/next/dist/bin/next start -H "${HOSTNAME:-0.0.0.0}" -p "${PORT:-3000}"
