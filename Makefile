PNPM=pnpm

.PHONY: install dev build test lint typecheck db-migrate db-seed verify-devnet verify-e2e

install:
	$(PNPM) install

dev:
	$(PNPM) dev

build:
	$(PNPM) build

test:
	$(PNPM) test

lint:
	$(PNPM) lint

typecheck:
	$(PNPM) typecheck

db-migrate:
	$(PNPM) db:migrate

db-seed:
	$(PNPM) db:seed

verify-devnet:
	$(PNPM) verify:devnet

verify-e2e:
	$(PNPM) verify:e2e

