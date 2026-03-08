import { openApiDocument } from '@compute-atlas/api-contract';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(openApiDocument);
}
