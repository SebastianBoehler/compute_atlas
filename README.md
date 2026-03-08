# Compute Atlas

Open-source compute price oracle infrastructure for transparent GPU market
indexing, public methodology review, and Solana devnet publication.

[GitHub repository](https://github.com/SebastianBoehler/compute_atlas)

## Why this exists

GPU pricing is fragmented across cloud vendors and specialized marketplaces.
Compute Atlas exists to make the aggregation, normalization, and publication
path inspectable in public:

- provider inputs are modular and traceable
- methodology is explicit and versioned
- normalized time-series data is queryable
- onchain publication behavior is reproducible

This repository is intended to be the auditable core. Paid products, if added
later, should be service layers on top of the same open codebase rather than a
closed replacement for it.

## License

This repository is licensed under Apache-2.0. That keeps the core open and
verifiable while still allowing commercial hosted products, support, and other
paid service layers to be offered later.

## Architecture

- `apps/web`: Next.js App Router dashboard plus public API
- `apps/worker`: ingestion, normalization, Solana publication, and verification
- `packages/db`: schema, migrations, seed data, and query helpers
- `packages/provider-sdk`: shared adapter interfaces and registry
- `packages/providers`: fixture-backed provider implementations
- `packages/methodology`: normalization and index calculation
- `packages/publisher-solana`: Solana devnet memo-based publisher and verifier
- `packages/api-contract`: typed response schemas and OpenAPI helpers

## Open-source model

The repository is open source first.

Open and auditable:

- methodology logic
- provider adapter interfaces
- public API contracts
- devnet publisher implementation
- dashboard transparency views

Possible paid layers later:

- managed hosted dashboard
- alerting and notifications
- higher-availability endpoints
- premium historical analytics
- team and access-control features

See [docs/OPEN_SOURCE_MODEL.md](/Users/sebastianboehler/Documents/GitHub/compute_atlas/docs/OPEN_SOURCE_MODEL.md) and [GOVERNANCE.md](/Users/sebastianboehler/Documents/GitHub/compute_atlas/GOVERNANCE.md).

## Quick start

```bash
cd /Users/sebastianboehler/Documents/GitHub/compute_atlas
nvm install 22
nvm use 22
corepack enable
cp .env.example .env
docker compose -f infra/docker/docker-compose.yml up -d db
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Useful commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:migrate
pnpm db:seed
pnpm solana:keypair:create
pnpm publish:devnet
pnpm verify:devnet
pnpm verify:e2e
```

## Environment variables

- `DATABASE_URL`: Postgres connection string.
- `TIMESCALE_ENABLED`: Enables Timescale-specific migration steps when the extension exists.
- `USE_MOCK_PROVIDERS`: Uses fixture-backed adapters instead of live credentials.
- `SOLANA_RPC_URL`: Solana devnet RPC endpoint.
- `SOLANA_RPC_WS_URL`: Solana websocket endpoint.
- `SOLANA_KEYPAIR_PATH`: Relative path from the repo root for the publisher keypair.
- `SOLANA_AIRDROP_MIN_BALANCE_SOL`: Auto-airdrop threshold used by verification.
- `SOLANA_AIRDROP_TARGET_BALANCE_SOL`: Desired balance after airdrop.
- `ENABLE_ADMIN_UI`: Enables the admin page.
- `NEXT_PUBLIC_REPOSITORY_URL`: Repository link shown in the UI.

## Local services

- Web/API: `http://localhost:3000`
- Postgres: `localhost:55432`

## Cloud Run split

- `compute-atlas-web`: public web and API service
- `compute-atlas-worker`: request-driven pipeline job

Deploy assets live in [infra/cloudrun](/Users/sebastianboehler/Documents/GitHub/compute_atlas/infra/cloudrun).

## Community files

- [CONTRIBUTING.md](/Users/sebastianboehler/Documents/GitHub/compute_atlas/CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](/Users/sebastianboehler/Documents/GitHub/compute_atlas/CODE_OF_CONDUCT.md)
- [SECURITY.md](/Users/sebastianboehler/Documents/GitHub/compute_atlas/SECURITY.md)
- [GOVERNANCE.md](/Users/sebastianboehler/Documents/GitHub/compute_atlas/GOVERNANCE.md)
- [docs/ROADMAP.md](/Users/sebastianboehler/Documents/GitHub/compute_atlas/docs/ROADMAP.md)

## Current limitations

- Most provider integrations are working mocks until production credentials are
  added.
- Solana publication uses the Memo program for MVP verifiability rather than a
  dedicated custom oracle program.
- In-memory rate limiting and caching are suitable for single-instance
  deployments, not scaled multi-instance production.
