import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { getEnv } from '@compute-atlas/config';

import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var __computeAtlasPool: Pool | undefined;
}

const pool =
  globalThis.__computeAtlasPool ??
  new Pool({ connectionString: getEnv().DATABASE_URL });

if (!globalThis.__computeAtlasPool) {
  globalThis.__computeAtlasPool = pool;
}

export const db = drizzle(pool, { schema });
export const pgPool = pool;
