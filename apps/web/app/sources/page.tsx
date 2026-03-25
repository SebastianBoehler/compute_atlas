import { PageHero } from '../../components/page-hero';
import { SectionCard } from '../../components/section-card';
import {
  getSourceCoverageSummary,
  sourceAccessLabels,
  sourceCoverage,
} from '../../lib/source-coverage';

export const dynamic = 'force-dynamic';

export default function SourcesPage() {
  const summary = getSourceCoverageSummary();

  return (
    <div className="stack">
      <PageHero
        eyebrow="Provider source map"
        title="Not every major GPU provider has the same quality of price feed."
        description="A practical launch should start with providers that expose stable machine-readable prices, then add selective page-ingestion and marketplaces where the value is high enough to justify the normalization work."
      />

      <section className="metric-strip">
        <div className="card stat">
          <span className="muted">Tracked providers</span>
          <span className="stat-value">{summary.totalProviders}</span>
        </div>
        <div className="card stat">
          <span className="muted">API-capable sources</span>
          <span className="stat-value">{summary.apiReadyProviders}</span>
        </div>
        <div className="card stat">
          <span className="muted">Good launch candidates</span>
          <span className="stat-value">{summary.launchReadyProviders}</span>
        </div>
      </section>

      <SectionCard title="Coverage matrix" eyebrow="Current view">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Segment</th>
                <th>Access</th>
                <th>Status</th>
                <th>Coverage</th>
              </tr>
            </thead>
            <tbody>
              {sourceCoverage.map((entry) => (
                <tr key={entry.provider}>
                  <td>{entry.provider}</td>
                  <td>{entry.segment}</td>
                  <td>{sourceAccessLabels[entry.accessLevel]}</td>
                  <td>
                    <span
                      className={
                        entry.integrationStatus === 'ready' ? 'pill' : 'badge'
                      }
                    >
                      {entry.integrationStatus}
                    </span>
                  </td>
                  <td>
                    <div className="stack">
                      <span>{entry.coverage}</span>
                      <span className="muted">{entry.notes}</span>
                      <a
                        href={entry.referenceUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Reference
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid">
        <SectionCard title="Best v1 providers" eyebrow="Recommended first wave">
          <ul className="list">
            <li>
              AWS, Azure, and GCP for broad public cloud coverage through
              official pricing interfaces.
            </li>
            <li>
              Runpod and Vast.ai for live specialist and marketplace supply
              where pricing moves faster.
            </li>
            <li>
              CoreWeave and Lambda after that, mainly as public page-ingestion
              work.
            </li>
          </ul>
        </SectionCard>
        <SectionCard title="What not to promise" eyebrow="Scope discipline">
          <ul className="list">
            <li>
              Do not claim every provider is fully live if some only expose
              pricing pages.
            </li>
            <li>
              Do not merge raw marketplace offers with reserved-instance pricing
              without a clear price-type split.
            </li>
            <li>
              Do not hide coverage gaps; they are product information, not
              implementation detail.
            </li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
