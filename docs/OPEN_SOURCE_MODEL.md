# Open Source and Commercial Model

Compute Atlas is designed as an open-source, verifiable oracle core.

## What stays open

- provider adapter interfaces
- methodology logic
- public API contracts
- Solana devnet publisher implementation
- database schema and seed data
- dashboard code for transparency, methodology, and publication inspection

## What may become paid later

Paid offerings, if added later, will be service layers on top of the open
repository rather than restrictions on the core codebase. Examples:

- managed hosted dashboards
- alerting and notifications
- premium uptime and support
- team features and private workspaces
- premium historical analytics and exports
- managed mainnet publisher operations

## Trust model

The core trust claim of the project is that users can inspect:

- how data was sourced
- how values were normalized
- how index values were computed
- what was published onchain

That means the open-source core should remain the canonical reference for
methodology and publication behavior even if hosted products are added later.
