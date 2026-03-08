import { apiJson } from '../../../../lib/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  return apiJson({
    status: 'ok',
  });
}
