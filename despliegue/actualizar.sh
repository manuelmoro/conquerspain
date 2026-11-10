#!/bin/sh
# Despliega tirando de git: si origin/main tiene un commit nuevo y la verificacion de GitHub (CI) lo
# dio por bueno, lo trae y reconstruye el contenedor. Lo lanza cada cinco minutos el temporizador
# conquerspain-actualizar.timer; tambien se puede lanzar a mano.
set -eu
cd "$(dirname "$0")/.."
REPO=manuelmoro/conquerspain

git fetch --quiet origin main
ACTUAL=$(git rev-parse HEAD)
NUEVO=$(git rev-parse origin/main)
if [ "$ACTUAL" = "$NUEVO" ] && [ "${1:-}" != "--forzar" ]; then
  exit 0
fi

# Solo lo que paso la verificacion: todas las comprobaciones del commit, terminadas y en verde.
ESTADO=$(curl -fsS "https://api.github.com/repos/$REPO/commits/$NUEVO/check-runs" \
  | python3 -c 'import json,sys; r=json.load(sys.stdin)["check_runs"]; print("ok" if r and all(c["status"]=="completed" and c["conclusion"]=="success" for c in r) else "espera")')
if [ "$ESTADO" != "ok" ] && [ "${1:-}" != "--forzar" ]; then
  echo "El commit $NUEVO aun no ha pasado la verificacion: se espera."
  exit 0
fi

git merge --quiet --ff-only origin/main
docker compose up -d --build --remove-orphans
docker image prune -f >/dev/null
echo "Desplegado $NUEVO."
