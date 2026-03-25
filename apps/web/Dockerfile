FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json biome.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY packages/api-contract/package.json packages/api-contract/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/methodology/package.json packages/methodology/package.json
COPY packages/observability/package.json packages/observability/package.json
COPY packages/provider-sdk/package.json packages/provider-sdk/package.json
COPY packages/providers/package.json packages/providers/package.json
COPY packages/publisher-sdk/package.json packages/publisher-sdk/package.json
COPY packages/publisher-solana/package.json packages/publisher-solana/package.json
COPY packages/testkit/package.json packages/testkit/package.json
COPY packages/types/package.json packages/types/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY . .
RUN pnpm --filter @compute-atlas/web build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/tsconfig.base.json ./tsconfig.base.json
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/packages ./packages
EXPOSE 3000
CMD ["pnpm", "--filter", "@compute-atlas/web", "start"]
