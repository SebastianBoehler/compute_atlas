import { PageHero } from '../../components/page-hero';
import { SectionCard } from '../../components/section-card';
import { getProvidersData } from '../../lib/data';

export const dynamic = 'force-dynamic';

export default async function ProvidersPage() {
  const providers = await getProvidersData();

  return (
    <div className="stack">
      <PageHero
        eyebrow="Source transparency"
        title="Providers should read like data sources, not protocol integrations."
        description="This registry shows which providers feed the aggregator, what type of market they represent, and whether they are active in the current normalized price set."
      />
      <SectionCard title="Provider registry" eyebrow="Sources">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Category</th>
                <th>Status</th>
                <th>Capabilities</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <td>{provider.name}</td>
                  <td>
                    <span className="code-inline">{provider.slug}</span>
                  </td>
                  <td>{provider.category}</td>
                  <td>
                    <span className={provider.isActive ? 'pill' : 'badge'}>
                      {provider.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="token-list">
                      {Array.isArray(provider.metadata?.capabilities) ? (
                        provider.metadata.capabilities.map((capability) => (
                          <span className="tag" key={String(capability)}>
                            {String(capability)}
                          </span>
                        ))
                      ) : (
                        <span className="muted">n/a</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
