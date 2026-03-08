import path from 'node:path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@compute-atlas/api-contract',
    '@compute-atlas/config',
    '@compute-atlas/db',
    '@compute-atlas/methodology',
    '@compute-atlas/observability',
    '@compute-atlas/providers',
    '@compute-atlas/types',
  ],
  turbopack: {
    root: path.join(import.meta.dirname, '../..'),
  },
};

export default nextConfig;
