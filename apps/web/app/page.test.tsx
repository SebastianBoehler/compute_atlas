import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../lib/data', () => ({
  getInstrumentsData: vi.fn(async () => [
    {
      id: 'instrument-1',
      symbol: 'H100_GLOBAL_SPOT',
      gpuModel: 'H100',
      region: 'global',
      priceType: 'spot',
    },
  ]),
  getInstrumentLatest: vi.fn(async () => ({
    observedAt: new Date('2026-03-25T12:00:00.000Z').toISOString(),
    priceUsdPerHour: 2.58,
    sourceCount: 3,
    confidenceScore: 0.91,
  })),
  getInstrumentHistory: vi.fn(async () => [
    {
      observedAt: new Date('2026-02-25T12:00:00.000Z').toISOString(),
      priceUsdPerHour: 2.22,
    },
  ]),
}));

describe('HomePage', () => {
  it('renders the simplified price board', async () => {
    const { default: HomePage } = await import('./page');
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain('GPU price board');
    expect(html).toContain('H100_GLOBAL_SPOT');
    expect(html).toContain('Straight view of current GPU rates');
  });
});
