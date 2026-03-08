import { relations, sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const providers = pgTable('providers', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  metadata: jsonb('metadata')
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const providerMarkets = pgTable(
  'provider_markets',
  {
    id: text('id').primaryKey(),
    providerId: text('provider_id')
      .notNull()
      .references(() => providers.id, { onDelete: 'cascade' }),
    externalId: text('external_id').notNull(),
    displayName: text('display_name').notNull(),
    region: text('region').notNull(),
    gpuModel: text('gpu_model').notNull(),
    priceType: text('price_type').notNull(),
    currency: text('currency').notNull(),
    unit: text('unit').notNull(),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    providerIdx: index('idx_provider_markets_provider_id').on(table.providerId),
  }),
);

export const rawPriceObservations = pgTable(
  'raw_price_observations',
  {
    id: text('id').primaryKey(),
    providerId: text('provider_id')
      .notNull()
      .references(() => providers.id, { onDelete: 'cascade' }),
    marketId: text('market_id').references(() => providerMarkets.id, {
      onDelete: 'set null',
    }),
    observedAt: timestamp('observed_at', { withTimezone: true }).notNull(),
    fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull(),
    region: text('region').notNull(),
    gpuModel: text('gpu_model').notNull(),
    priceType: text('price_type').notNull(),
    currency: text('currency').notNull(),
    unit: text('unit').notNull(),
    price: doublePrecision('price').notNull(),
    normalizedPriceUsdPerHour: doublePrecision('normalized_price_usd_per_hour'),
    confidenceScore: doublePrecision('confidence_score').notNull(),
    provenanceUrl: text('provenance_url'),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    rawPayload: jsonb('raw_payload')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    providerObservedIdx: index(
      'idx_raw_price_observations_provider_observed_at',
    ).on(table.providerId, table.observedAt),
    gpuRegionIdx: index('idx_raw_price_observations_gpu_region').on(
      table.gpuModel,
      table.region,
      table.priceType,
    ),
  }),
);

export const normalizedInstruments = pgTable('normalized_instruments', {
  id: text('id').primaryKey(),
  symbol: text('symbol').notNull().unique(),
  name: text('name').notNull(),
  gpuModel: text('gpu_model').notNull(),
  region: text('region').notNull(),
  regionScope: text('region_scope').notNull(),
  priceType: text('price_type').notNull(),
  quoteCurrency: text('quote_currency').notNull(),
  unit: text('unit').notNull(),
  methodologyKey: text('methodology_key').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  metadata: jsonb('metadata')
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const normalizedPricePoints = pgTable(
  'normalized_price_points',
  {
    id: text('id').primaryKey(),
    instrumentId: text('instrument_id')
      .notNull()
      .references(() => normalizedInstruments.id, { onDelete: 'cascade' }),
    symbol: text('symbol').notNull(),
    observedAt: timestamp('observed_at', { withTimezone: true }).notNull(),
    priceUsdPerHour: doublePrecision('price_usd_per_hour').notNull(),
    confidenceScore: doublePrecision('confidence_score').notNull(),
    sourceCount: integer('source_count').notNull(),
    includedObservationIds: jsonb('included_observation_ids')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    excludedSources: jsonb('excluded_sources')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    methodologyVersion: text('methodology_version').notNull(),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    symbolObservedIdx: index(
      'idx_normalized_price_points_symbol_observed_at',
    ).on(table.symbol, table.observedAt),
  }),
);

export const oraclePublications = pgTable(
  'oracle_publications',
  {
    id: text('id').primaryKey(),
    chain: text('chain').notNull(),
    publisher: text('publisher').notNull(),
    instrumentSymbol: text('instrument_symbol').notNull(),
    txSignature: text('tx_signature').notNull(),
    slot: bigint('slot', { mode: 'number' }),
    status: text('status').notNull(),
    payload: jsonb('payload')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    payloadHash: text('payload_hash').notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    explorerUrl: text('explorer_url'),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    symbolPublishedIdx: index('idx_oracle_publications_symbol_published_at').on(
      table.instrumentSymbol,
      table.publishedAt,
    ),
    publisherIdx: index('idx_oracle_publications_publisher').on(
      table.publisher,
      table.publishedAt,
    ),
  }),
);

export const publicationFailures = pgTable('publication_failures', {
  id: text('id').primaryKey(),
  chain: text('chain').notNull(),
  publisher: text('publisher').notNull(),
  instrumentSymbol: text('instrument_symbol').notNull(),
  errorCode: text('error_code').notNull(),
  errorMessage: text('error_message').notNull(),
  payload: jsonb('payload')
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  metadata: jsonb('metadata')
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const ingestionRuns = pgTable('ingestion_runs', {
  id: text('id').primaryKey(),
  providerId: text('provider_id').references(() => providers.id, {
    onDelete: 'set null',
  }),
  jobType: text('job_type').notNull(),
  status: text('status').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  recordsRead: integer('records_read').notNull().default(0),
  recordsWritten: integer('records_written').notNull().default(0),
  errorMessage: text('error_message'),
  metadata: jsonb('metadata')
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  metadata: jsonb('metadata')
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const providerRelations = relations(providers, ({ many }) => ({
  markets: many(providerMarkets),
  observations: many(rawPriceObservations),
}));

export const providerMarketRelations = relations(
  providerMarkets,
  ({ one }) => ({
    provider: one(providers, {
      fields: [providerMarkets.providerId],
      references: [providers.id],
    }),
  }),
);
