#!/usr/bin/env bash
# One-command install on a Linux server that already has Docker.
# Serves the app over plain http on http://<server-ip>:<port> (no domain needed).
#
#   curl -fsSL https://raw.githubusercontent.com/itspiyushpaatni-lang/postify/main/scripts/install.sh | bash
#
# Safe to run again: it keeps the existing .env and just pulls the latest image.
set -euo pipefail

REPO_RAW="https://raw.githubusercontent.com/itspiyushpaatni-lang/postify/main"
DIR="${POSTIFY_DIR:-$HOME/postify}"
PORT="${POSTIFY_PORT:-5000}"

command -v docker >/dev/null || { echo "Docker is not installed on this server. Stop here and report this message."; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "The 'docker compose' plugin is missing. Stop here and report this message."; exit 1; }

mkdir -p "$DIR" && cd "$DIR"
curl -fsSL "$REPO_RAW/docker-compose.lean.yaml" -o docker-compose.yaml

if [ ! -f .env ]; then
  while ss -ltn 2>/dev/null | grep -q ":$PORT "; do PORT=$((PORT + 1)); done
  IP="${POSTIFY_HOST:-$(curl -4 -fsS https://api.ipify.org || hostname -I | awk '{print $1}')}"
  cat > .env <<ENV
POSTIFY_BIND=0.0.0.0
POSTIFY_PORT=$PORT
POSTGRES_PASSWORD=$(openssl rand -hex 16)
JWT_SECRET=$(openssl rand -hex 32)
FRONTEND_URL=http://$IP:$PORT
NEXT_PUBLIC_BACKEND_URL=http://$IP:$PORT/api
NOT_SECURED=true
NX_ADD_PLUGINS=false
API_LIMIT=30
OPENAI_API_KEY=
ENV
  chmod 600 .env
fi

docker compose pull
docker compose up -d

PORT=$(sed -n 's/^POSTIFY_PORT=//p' .env)
if command -v ufw >/dev/null && ufw status 2>/dev/null | grep -q "Status: active"; then
  ufw allow "$PORT/tcp" >/dev/null || true
fi

echo
echo "Waiting for the app to start (first start takes about a minute)..."
for i in $(seq 1 60); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/"; then break; fi
  sleep 3
done
docker compose ps
echo
echo "Open: $(sed -n 's/^FRONTEND_URL=//p' .env)"
echo "Settings file: $DIR/.env   |   Logs: cd $DIR && docker compose logs -f app"
