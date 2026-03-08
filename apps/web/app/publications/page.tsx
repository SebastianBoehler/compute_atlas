import { PageHero } from '../../components/page-hero';
import { SectionCard } from '../../components/section-card';
import { getPublicationExplorerData } from '../../lib/data';

export const dynamic = 'force-dynamic';

export default async function PublicationsPage() {
  const publications = await getPublicationExplorerData();

  return (
    <div className="stack">
      <PageHero
        eyebrow="Solana devnet"
        title="Publication history stays inspectable."
        description="Every publication record should expose the transaction signature, slot, timestamp, status, and payload so users can compare dashboard state with onchain state."
      />
      <SectionCard title="Publication explorer" eyebrow="Latest writes">
        <div className="stack">
          {publications.map((publication) => (
            <div className="card stack" key={publication.id}>
              <div className="split">
                <div className="stack">
                  <div className="eyebrow">{publication.instrumentSymbol}</div>
                  <strong className="code-inline">
                    {publication.txSignature}
                  </strong>
                </div>
                <span
                  className={
                    publication.status === 'confirmed' ? 'pill' : 'badge'
                  }
                >
                  {publication.status}
                </span>
              </div>
              <div className="info-grid">
                <div className="stack">
                  <span className="muted">Slot</span>
                  <strong>{publication.slot ?? 'n/a'}</strong>
                </div>
                <div className="stack">
                  <span className="muted">Timestamp</span>
                  <strong>
                    {new Date(publication.publishedAt).toLocaleString()}
                  </strong>
                </div>
              </div>
              {publication.explorerUrl ? (
                <a
                  href={publication.explorerUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open in Solana Explorer
                </a>
              ) : null}
              <pre>{JSON.stringify(publication.payload, null, 2)}</pre>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
