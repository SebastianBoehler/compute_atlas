import { notFound } from 'next/navigation';

import { PageHero } from '../../../components/page-hero';
import { PriceChart } from '../../../components/price-chart';
import { SectionCard } from '../../../components/section-card';
import { getInstrumentPageData } from '../../../lib/data';

export const dynamic = 'force-dynamic';

export default async function InstrumentDetailPage({
  params,
}: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const data = await getInstrumentPageData(symbol);

  if (!data.instrument || !data.latest) {
    notFound();
  }

  return (
    <div className="stack">
      <PageHero
        eyebrow={`${data.instrument.gpuModel} · ${data.instrument.region}`}
        title={data.instrument.symbol}
        description="This page shows the latest normalized value, confidence score, historical path, and source count for the selected instrument."
        aside={
          <div className="hero-meta-grid">
            <div className="surface-panel stat">
              <span className="muted">Latest price</span>
              <span className="stat-number">
                ${data.latest.priceUsdPerHour.toFixed(2)}
              </span>
            </div>
            <div className="surface-panel stat">
              <span className="muted">Confidence</span>
              <span className="stat-number">
                {(data.latest.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>
            <div className="surface-panel stat">
              <span className="muted">Sources</span>
              <span className="stat-number">{data.latest.sourceCount}</span>
            </div>
            <div className="surface-panel stat">
              <span className="muted">Methodology</span>
              <span className="code-inline">
                {data.latest.methodologyVersion}
              </span>
            </div>
          </div>
        }
      />
      <SectionCard
        title="Historical pricing"
        eyebrow="Normalized USD per GPU hour"
      >
        <PriceChart
          data={data.history.map((point) => ({
            observedAt: point.observedAt,
            priceUsdPerHour: point.priceUsdPerHour,
          }))}
        />
      </SectionCard>
      <SectionCard title="Computation context" eyebrow="Audit snapshot">
        <div className="info-grid">
          <div className="stack">
            <span className="muted">Included observations</span>
            <div className="token-list">
              {data.latest.includedObservationIds.map((id) => (
                <span className="tag" key={id}>
                  {id}
                </span>
              ))}
            </div>
          </div>
          <div className="stack">
            <span className="muted">Excluded sources</span>
            {data.latest.excludedSources.length > 0 ? (
              <div className="token-list">
                {data.latest.excludedSources.map((source) => (
                  <span className="tag" key={source}>
                    {source}
                  </span>
                ))}
              </div>
            ) : (
              <span className="muted">
                No excluded sources in the latest point.
              </span>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
