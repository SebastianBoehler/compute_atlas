import { PriceBoard, type PriceBoardRow } from '../components/price-board';
import {
  getInstrumentHistory,
  getInstrumentLatest,
  getInstrumentsData,
} from '../lib/data';

export const dynamic = 'force-dynamic';

const sortRows = (rows: PriceBoardRow[]) =>
  [...rows].sort((left, right) => {
    const leftValue = left.latestPrice ?? -1;
    const rightValue = right.latestPrice ?? -1;
    return rightValue - leftValue;
  });

const getChangePercent = (
  currentPrice: number | null,
  previousPrice: number | null,
) => {
  if (currentPrice === null || previousPrice === null || previousPrice === 0) {
    return null;
  }

  return ((currentPrice - previousPrice) / previousPrice) * 100;
};

export default async function HomePage() {
  const instruments = await getInstrumentsData();

  const rows = await Promise.all(
    instruments.map(async (instrument) => {
      const [latest, history] = await Promise.all([
        getInstrumentLatest(instrument.symbol),
        getInstrumentHistory(instrument.symbol, '30d'),
      ]);

      const firstHistoryPrice =
        history.find((entry) => entry.priceUsdPerHour > 0)?.priceUsdPerHour ??
        null;

      return {
        symbol: instrument.symbol,
        gpuModel: instrument.gpuModel,
        priceType: instrument.priceType,
        latestPrice: latest?.priceUsdPerHour ?? null,
        observedAt: latest?.observedAt ?? null,
        sourceCount: latest?.sourceCount ?? null,
        confidenceScore: latest?.confidenceScore ?? null,
        changePercent: getChangePercent(
          latest?.priceUsdPerHour ?? null,
          firstHistoryPrice,
        ),
      } satisfies PriceBoardRow;
    }),
  );

  return <PriceBoard rows={sortRows(rows)} />;
}
