import Link from 'next/link';

import { PageHero } from '../../components/page-hero';
import { SectionCard } from '../../components/section-card';
import { getInstrumentsData } from '../../lib/data';

export const dynamic = 'force-dynamic';

export default async function InstrumentsPage() {
  const instruments = await getInstrumentsData();

  return (
    <div className="stack">
      <PageHero
        eyebrow="Normalized price views"
        title="Comparable GPU markets instead of provider-specific SKU clutter."
        description="Each instrument is a normalized market slice defined by GPU model, region, and price type so the app can compare providers on one surface."
      />
      <SectionCard title="Instrument list" eyebrow="Coverage">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>GPU</th>
                <th>Region</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {instruments.map((instrument) => (
                <tr key={instrument.id}>
                  <td>
                    <Link href={`/instruments/${instrument.symbol}`}>
                      {instrument.symbol}
                    </Link>
                  </td>
                  <td>{instrument.gpuModel}</td>
                  <td>{instrument.region}</td>
                  <td>{instrument.priceType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
