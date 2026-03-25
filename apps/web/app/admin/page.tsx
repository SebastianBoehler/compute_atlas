import { getEnv } from '@compute-atlas/config';

import { PageHero } from '../../components/page-hero';
import { SectionCard } from '../../components/section-card';
import { getDashboardSummary } from '../../lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const env = getEnv();
  if (!env.ENABLE_ADMIN_UI) {
    return (
      <div className="stack">
        <PageHero
          eyebrow="Internal controls"
          title="Admin UI is disabled."
          description="Enable the admin page only in local or intentionally protected environments."
        />
        <SectionCard title="Access">
          Enable <span className="code-inline">ENABLE_ADMIN_UI=true</span> to
          view this page.
        </SectionCard>
      </div>
    );
  }

  const summary = await getDashboardSummary();

  return (
    <div className="stack">
      <PageHero
        eyebrow="Internal controls"
        title="Local environment summary."
        description="This view is intentionally simple and should stay behind explicit environment gating or stronger auth in production."
      />
      <SectionCard title="Admin / Dev" eyebrow="Environment">
        <pre>
          {JSON.stringify(
            {
              environment: env.NODE_ENV,
              timescaleEnabled: env.TIMESCALE_ENABLED,
              enablePublications: env.ENABLE_PUBLICATIONS,
              summary,
            },
            null,
            2,
          )}
        </pre>
      </SectionCard>
    </div>
  );
}
