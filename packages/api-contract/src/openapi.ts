export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Compute Atlas API',
    version: '1.0.0',
  },
  paths: {
    '/api/v1/health': { get: { summary: 'Health check' } },
    '/api/v1/instruments': { get: { summary: 'List instruments' } },
    '/api/v1/instruments/{symbol}/latest': {
      get: { summary: 'Latest instrument price' },
    },
    '/api/v1/instruments/{symbol}/history': {
      get: { summary: 'Instrument history' },
    },
    '/api/v1/providers': { get: { summary: 'List providers' } },
    '/api/v1/publications': { get: { summary: 'List oracle publications' } },
    '/api/v1/methodology': { get: { summary: 'Methodology report' } },
  },
};
