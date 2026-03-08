import { beforeEach, describe, expect, it, vi } from 'vitest';

const report = [
  {
    symbol: 'H100_GLOBAL_SPOT',
    methodologyVersion: '2026-03-mvp',
    config: { staleAfterMinutes: 180 },
    latest: {
      priceUsdPerHour: 2.58,
      confidenceScore: 0.92,
      intervalLow: 2.5,
      intervalHigh: 2.61,
      sourceCount: 3,
      includedObservationIds: ['obs-1'],
      excludedSources: [],
    },
  },
];

vi.mock('../../../../lib/data', () => ({
  getMethodologyReport: vi.fn(async () => report),
}));

describe('GET /api/v1/methodology', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns a typed methodology report payload', async () => {
    const { GET } = await import('./route');
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data[0].symbol).toBe('H100_GLOBAL_SPOT');
    expect(json.meta.generatedAt).toBeTypeOf('string');
  });
});
