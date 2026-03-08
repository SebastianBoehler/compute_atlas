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
        eyebrow="Normalized instruments"
        title="Symbols designed for comparison, not provider noise."
        description="Each instrument represents a normalized view of a GPU market segment such as model, region, and price type. The point is to make provider-specific listings comparable and auditable."
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
