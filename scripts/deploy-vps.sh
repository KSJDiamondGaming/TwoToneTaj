#!/usr/bin/env bash
set -Eeuo pipefail

SITE_DIR="${SITE_DIR:-/home/twotonetaj/site}"
BRANCH="${BRANCH:-main}"
LIVE_URL="${LIVE_URL:-https://twotonetaj.ksjdigital.co.uk}"

log() {
  printf '\n[TwoToneTaj Deploy] %s\n' "$1"
}

if [[ ! -d "$SITE_DIR/.git" ]]; then
  echo "Error: $SITE_DIR is not a Git repository." >&2
  exit 1
fi

cd "$SITE_DIR"

log "Fetching latest repository state"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

log "Installing locked dependencies"
npm ci

log "Validating merch launch configuration"
npm run validate:merch

log "Running production build"
npm run build

if [[ ! -f dist/index.html ]]; then
  echo "Error: dist/index.html was not created." >&2
  exit 1
fi

log "Validating Nginx configuration"
nginx -t

log "Reloading Nginx"
systemctl reload nginx

log "Running live route smoke checks"
for route in / /about /content /community /merch /contact /privacy /terms; do
  status="$(curl -L -sS -o /dev/null -w '%{http_code}' "${LIVE_URL}${route}")"

  if [[ "$status" != "200" ]]; then
    echo "Error: ${LIVE_URL}${route} returned HTTP $status." >&2
    exit 1
  fi

  printf '  OK  %s%s\n' "$LIVE_URL" "$route"
done

log "Deployment completed successfully"
