CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_markets (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  region TEXT NOT NULL,
  gpu_model TEXT NOT NULL,
  price_type TEXT NOT NULL,
  currency TEXT NOT NULL,
  unit TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS raw_price_observations (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  market_id TEXT REFERENCES provider_markets(id) ON DELETE SET NULL,
  observed_at TIMESTAMPTZ NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL,
  region TEXT NOT NULL,
  gpu_model TEXT NOT NULL,
  price_type TEXT NOT NULL,
  currency TEXT NOT NULL,
  unit TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  normalized_price_usd_per_hour DOUBLE PRECISION,
  confidence_score DOUBLE PRECISION NOT NULL,
  provenance_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS normalized_instruments (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  gpu_model TEXT NOT NULL,
  region TEXT NOT NULL,
  region_scope TEXT NOT NULL,
  price_type TEXT NOT NULL,
  quote_currency TEXT NOT NULL,
  unit TEXT NOT NULL,
  methodology_key TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS normalized_price_points (
  id TEXT PRIMARY KEY,
  instrument_id TEXT NOT NULL REFERENCES normalized_instruments(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL,
  price_usd_per_hour DOUBLE PRECISION NOT NULL,
  confidence_score DOUBLE PRECISION NOT NULL,
  source_count INTEGER NOT NULL,
  included_observation_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  excluded_sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  methodology_version TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS oracle_publications (
  id TEXT PRIMARY KEY,
  chain TEXT NOT NULL,
  publisher TEXT NOT NULL,
  instrument_symbol TEXT NOT NULL,
  tx_signature TEXT NOT NULL,
  slot BIGINT,
  status TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  payload_hash TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  confirmed_at TIMESTAMPTZ,
  explorer_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publication_failures (
  id TEXT PRIMARY KEY,
  chain TEXT NOT NULL,
  publisher TEXT NOT NULL,
  instrument_symbol TEXT NOT NULL,
  error_code TEXT NOT NULL,
  error_message TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingestion_runs (
  id TEXT PRIMARY KEY,
  provider_id TEXT REFERENCES providers(id) ON DELETE SET NULL,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  records_read INTEGER NOT NULL DEFAULT 0,
  records_written INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_provider_markets_provider_id ON provider_markets(provider_id);
CREATE INDEX IF NOT EXISTS idx_raw_price_observations_provider_observed_at ON raw_price_observations(provider_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_price_observations_gpu_region ON raw_price_observations(gpu_model, region, price_type);
CREATE INDEX IF NOT EXISTS idx_normalized_price_points_symbol_observed_at ON normalized_price_points(symbol, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_oracle_publications_symbol_published_at ON oracle_publications(instrument_symbol, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_oracle_publications_publisher ON oracle_publications(publisher, published_at DESC);

