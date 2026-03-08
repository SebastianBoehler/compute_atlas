import Link from 'next/link';
import React from 'react';

import { getEnv } from '@compute-atlas/config';

import { PageHero } from '../components/page-hero';
import { SectionCard } from '../components/section-card';
import {
  getDashboardSummary,
  getInstrumentsData,
  getPublicationExplorerData,
} from '../lib/data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const env = getEnv();
  const [summary, instruments, publications] = await Promise.all([
    getDashboardSummary(),
    getInstrumentsData(),
    getPublicationExplorerData(),
  ]);

  return (
    <div className="stack">
      <PageHero
        eyebrow="Open Compute Oracle"
        title="Transparent GPU price discovery with public methodology."
        description="Compute Atlas aggregates cloud and marketplace pricing, normalizes it into auditable GPU instruments, exposes a typed API, and publishes selected values to Solana devnet. The core stays open so users can verify how values were sourced, cleaned, and published."
        actions={
          <>
            <Link className="button button-primary" href="/methodology">
              Review methodology
            </Link>
            <Link className="button" href="/publications">
              Inspect devnet publications
            </Link>
            <a
              className="button"
              href={env.NEXT_PUBLIC_REPOSITORY_URL}
              rel="noreferrer"
              target="_blank"
            >
              View source
            </a>
          </>
        }
        aside={
          <>
            <div className="surface-panel stack">
              <div className="split">
                <div>
                  <div className="eyebrow">Live coverage</div>
                  <h3>Tracked instruments</h3>
                </div>
                <span className="pill">{instruments.length} live</span>
              </div>
              {instruments.slice(0, 3).map((instrument) => (
                <div className="timeline-item" key={instrument.id}>
                  <div className="stack">
                    <strong>{instrument.symbol}</strong>
                    <span className="muted">
                      {instrument.gpuModel} · {instrument.region}
                    </span>
                  </div>
                  <span className="tag">{instrument.priceType}</span>
                </div>
              ))}
            </div>
            <div className="surface-panel stack">
              <div className="eyebrow">Open-core model</div>
              <p>
                The methodology and publisher stay public. Paid products can be
                added later as managed service layers, not as a closed rewrite
                of the oracle core.
              </p>
            </div>
          </>
        }
      />

      <section className="metric-strip">
        <div className="card stat">
          <span className="muted">Providers</span>
          <span className="stat-value">{summary.providerCount}</span>
        </div>
        <div className="card stat">
          <span className="muted">Instruments</span>
          <span className="stat-value">{summary.instrumentCount}</span>
        </div>
        <div className="card stat">
          <span className="muted">Recent publications</span>
          <span className="stat-value">{summary.publicationCount}</span>
        </div>
      </section>

      <div className="grid">
        <SectionCard title="Tracked instruments" eyebrow="Market coverage">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Symbol</th>
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
                    <td>{instrument.region}</td>
                    <td>{instrument.priceType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Recent oracle publications" eyebrow="Devnet state">
          <div className="timeline-list">
            {publications.slice(0, 5).map((publication) => (
              <div className="timeline-item" key={publication.id}>
                <div className="stack">
                  <strong>{publication.instrumentSymbol}</strong>
                  <span className="code-inline">{publication.txSignature}</span>
                </div>
                <span className="badge">{publication.status}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid">
        <SectionCard title="Why open source matters" eyebrow="Trust model">
          <ul className="list">
            <li>Source inputs and exclusion decisions remain reviewable.</li>
            <li>
              Methodology changes can be scrutinized in public pull requests.
            </li>
            <li>
              Onchain publication behavior can be reproduced from the repo.
            </li>
          </ul>
        </SectionCard>
        <SectionCard title="Possible hosted layers" eyebrow="Commercial later">
          <ul className="list">
            <li>Managed uptime, alerts, and historical analytics.</li>
            <li>Private team dashboards and API access controls.</li>
            <li>
              Mainnet operations and support on top of the same open core.
            </li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
