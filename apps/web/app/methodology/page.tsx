import { PageHero } from '../../components/page-hero';
import { SectionCard } from '../../components/section-card';
import { getMethodologyReport } from '../../lib/data';

export const dynamic = 'force-dynamic';

export default async function MethodologyPage() {
  const report = await getMethodologyReport();

  return (
    <div className="stack">
      <PageHero
        eyebrow="Index construction"
        title="Methodology is part of the product, not a footnote."
        description="Each instrument filters stale data, removes obvious outliers, normalizes units and currency, and computes a robust weighted median. The latest point retains source count, exclusion reasons, and confidence context."
      />

      {report.map((entry) => (
        <SectionCard
          key={entry.symbol}
          title={entry.symbol}
          aside={<span className="pill">{entry.methodologyVersion}</span>}
        >
          <div className="info-grid">
            <div className="stack">
              <div className="muted">Configuration</div>
              <div className="token-list">
                {entry.config.allowedProviders.map((provider) => (
                  <span className="tag" key={provider}>
                    {provider}
                  </span>
                ))}
              </div>
              <div className="code-block">
                staleAfterMinutes: {entry.config.staleAfterMinutes}
                {'\n'}
                outlierThresholdPercent: {entry.config.outlierThresholdPercent}
                {'\n'}
                minimumSampleSize: {entry.config.minimumSampleSize}
                {'\n'}
                regionScope: {entry.config.regionScope}
              </div>
            </div>
            <div className="stack">
              <div className="muted">Latest report</div>
              {entry.latest ? (
                <div className="code-block">
                  priceUsdPerHour: {entry.latest.priceUsdPerHour.toFixed(4)}
                  {'\n'}
                  confidenceScore: {entry.latest.confidenceScore.toFixed(4)}
                  {'\n'}
                  intervalLow: {entry.latest.intervalLow.toFixed(4)}
                  {'\n'}
                  intervalHigh: {entry.latest.intervalHigh.toFixed(4)}
                  {'\n'}
                  sourceCount: {entry.latest.sourceCount}
                  {'\n'}
                  includedObservationIds:{' '}
                  {entry.latest.includedObservationIds.join(', ') || 'none'}
                  {'\n'}
                  excludedSources:{' '}
                  {entry.latest.excludedSources.join(', ') || 'none'}
                </div>
              ) : (
                <p>No latest methodology output is available yet.</p>
              )}
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
