import fs from 'node:fs/promises';
import path from 'node:path';

import 'dotenv/config';

import { getEnv } from '@compute-atlas/config';

import { pgPool } from './client';

const makeHypertable = async (table: string, timeColumn: string) => {
  try {
    await pgPool.query(
      `SELECT create_hypertable('${table}', '${timeColumn}', if_not_exists => TRUE);`,
    );
  } catch (error) {
    console.warn(`Timescale hypertable skipped for ${table}:`, error);
  }
};

const run = async () => {
  const filePath = path.resolve(process.cwd(), 'drizzle/0000_init.sql');
  const sql = await fs.readFile(filePath, 'utf8');
  await pgPool.query(sql);

  if (getEnv().TIMESCALE_ENABLED) {
    try {
      await pgPool.query('CREATE EXTENSION IF NOT EXISTS timescaledb;');
      await makeHypertable('raw_price_observations', 'observed_at');
      await makeHypertable('normalized_price_points', 'observed_at');
      await makeHypertable('oracle_publications', 'published_at');
    } catch (error) {
      console.warn('Timescale extension setup skipped:', error);
    }
  }

  console.log('Database migration completed.');
  await pgPool.end();
};

run().catch(async (error) => {
  console.error(error);
  await pgPool.end();
  process.exit(1);
});
