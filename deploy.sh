#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
git pull origin main
docker compose up --build -d
echo "Done. Landing page updated at /landing-page/"
