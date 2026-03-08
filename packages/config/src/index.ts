import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  LOG_LEVEL: z.string().default('info'),
  DATABASE_URL: z
    .string()
    .min(1)
    .default('postgres://postgres:postgres@localhost:55432/compute_atlas'),
  APP_BASE_URL: z.string().url().default('http://localhost:3000'),
  API_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  API_RATE_LIMIT_MAX: z.coerce.number().default(120),
  API_CACHE_TTL_MS: z.coerce.number().default(15_000),
  ENABLE_ADMIN_UI: z
    .string()
    .default('false')
    .transform((value) => value === 'true'),
  ADMIN_BASIC_AUTH_USER: z.string().default('admin'),
  ADMIN_BASIC_AUTH_PASSWORD: z.string().default('change-me'),
  DEFAULT_CURRENCY: z.string().default('USD'),
  TIMESCALE_ENABLED: z
    .string()
    .default('true')
    .transform((value) => value === 'true'),
  USE_MOCK_PROVIDERS: z
    .string()
    .default('true')
    .transform((value) => value === 'true'),
  SOLANA_RPC_URL: z.string().url().default('https://api.devnet.solana.com'),
  SOLANA_RPC_WS_URL: z.string().default('wss://api.devnet.solana.com'),
  SOLANA_KEYPAIR_PATH: z.string().default('./data/solana/devnet-keypair.json'),
  SOLANA_AIRDROP_MIN_BALANCE_SOL: z.coerce.number().default(0.25),
  SOLANA_AIRDROP_TARGET_BALANCE_SOL: z.coerce.number().default(1),
  SOLANA_COMMITMENT: z
    .enum(['processed', 'confirmed', 'finalized'])
    .default('confirmed'),
  SOLANA_PUBLISHER_LABEL: z.string().default('compute-atlas-mvp'),
  SOLANA_MEMO_MAX_BYTES: z.coerce.number().default(512),
  PIPELINE_DEFAULT_SYMBOLS: z
    .string()
    .default('H100_GLOBAL_SPOT,H100_EU_SPOT,A100_GLOBAL_SPOT'),
  PUBLISH_SYMBOLS: z.string().default('H100_GLOBAL_SPOT,A100_GLOBAL_SPOT'),
  CUSTOM_JSON_FEED_URL: z
    .string()
    .url()
    .default('http://localhost:3000/mock/custom-provider.json'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Compute Atlas'),
  NEXT_PUBLIC_REPOSITORY_URL: z
    .string()
    .url()
    .default('https://github.com/SebastianBoehler/compute_atlas'),
});

let cachedEnv: z.infer<typeof envSchema> | undefined;

export const getEnv = () => {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }

  return cachedEnv;
};

export const getPipelineSymbols = () =>
  getEnv()
    .PIPELINE_DEFAULT_SYMBOLS.split(',')
    .map((value) => value.trim())
    .filter(Boolean);

export const getPublishSymbols = () =>
  getEnv()
    .PUBLISH_SYMBOLS.split(',')
    .map((value) => value.trim())
    .filter(Boolean);
