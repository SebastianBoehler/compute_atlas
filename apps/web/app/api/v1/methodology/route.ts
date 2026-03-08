import { methodologyReportSchema } from '@compute-atlas/api-contract';

import { getMethodologyReport } from '../../../../lib/data';
import { apiJson } from '../../../../lib/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getMethodologyReport();
  methodologyReportSchema.array().parse(data);
  return apiJson(data);
}
