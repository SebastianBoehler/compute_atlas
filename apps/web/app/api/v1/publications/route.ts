import { publicationSchema } from '@compute-atlas/api-contract';

import { getPublicationExplorerData } from '../../../../lib/data';
import { apiJson } from '../../../../lib/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getPublicationExplorerData();
  publicationSchema.array().parse(
    data.map((entry) => ({
      ...entry,
      slot: entry.slot ?? null,
      confirmedAt: entry.confirmedAt ?? null,
      explorerUrl: entry.explorerUrl ?? null,
    })),
  );
  return apiJson(data);
}
