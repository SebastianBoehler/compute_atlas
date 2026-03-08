# Governance

Compute Atlas is run as an open-source oracle core with public methodology and
public review of material changes.

## Maintainers

The initial maintainer is Sebastian Boehler. Additional maintainers may be
added over time based on sustained contributions and review quality.

## Decision model

### Ordinary changes

Routine fixes, docs, tests, and internal refactors can be merged after normal
review.

### High-scrutiny changes

The following changes require explicit maintainer sign-off and a clear rationale
in the pull request:

- methodology changes that alter published values
- schema changes affecting auditability or provenance
- Solana publisher changes
- provider adapter changes that materially affect price inclusion
- changes to licensing or contribution policy

## Transparency expectations

- Methodology changes should be explained in public pull requests.
- Publication logic should remain inspectable in the repository.
- Seed data and mocks should stay clearly labeled as non-production data.

## Commercial use

The repository is open source under Apache-2.0. Maintainers may later offer
paid hosted services on top of the open codebase, such as managed dashboards,
alerts, higher-availability endpoints, or premium analytics. Those services do
not change the licensing of the repository itself.

## Roadmap process

Roadmap proposals can start as GitHub issues or discussions. Larger changes can
be documented in short RFC-style pull requests before implementation.
