# Contributing

Compute Atlas is intended to be auditable in public. Contributions that improve
methodology transparency, provider quality, chain publishing reliability, and
developer ergonomics are welcome.

## Principles

- Keep the oracle core inspectable and reproducible.
- Prefer small, reviewable pull requests over large rewrites.
- Treat provider provenance and methodology changes as high-scrutiny changes.
- Preserve modular package boundaries.

## Local setup

```bash
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

## Before opening a pull request

Run the full local check set:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If you touched the Solana path, also run:

```bash
pnpm solana:keypair:create
pnpm verify:devnet
```

## Contribution types

### Provider adapters

- Implement the shared adapter contract in `packages/provider-sdk`.
- Add fixture-backed tests even when live credentials are unavailable.
- Include provenance metadata and clear TODOs where live integration work is
  still required.

### Methodology changes

- Explain the problem, the expected impact, and migration considerations.
- Update docs and tests together.
- Preserve an audit trail for exclusions, weights, and stale-data policy.

### UI and API changes

- Keep server-first rendering where practical.
- Avoid introducing client-side waterfalls or large client bundles without a
  clear reason.
- Maintain consistent status and provenance visibility in the dashboard.

## Commit and PR guidance

- Use descriptive commit messages.
- Reference issues when applicable.
- Include screenshots for material UI changes.
- Call out any schema, methodology, or publication compatibility changes.

## Review expectations

Pull requests may be held until they include:

- adequate tests
- updated docs
- provenance-sensitive reasoning for oracle changes
- migration notes for breaking changes
