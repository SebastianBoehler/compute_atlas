#!/usr/bin/env bash
set -euo pipefail

docker compose -f infra/docker/docker-compose.yml up -d db
pnpm db:migrate
pnpm db:seed
pnpm dev

