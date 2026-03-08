import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getEnv } from '@compute-atlas/config';

const env = getEnv();
const hits = new Map<string, { count: number; windowStarted: number }>();

const unauthorized = () =>
  new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Compute Atlas Admin"',
    },
  });

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin') && env.ENABLE_ADMIN_UI) {
    const auth = request.headers.get('authorization');
    if (auth) {
      const decoded = atob(auth.replace('Basic ', ''));
      const [user, password] = decoded.split(':');
      if (
        user === env.ADMIN_BASIC_AUTH_USER &&
        password === env.ADMIN_BASIC_AUTH_PASSWORD
      ) {
        return NextResponse.next();
      }
    }

    return unauthorized();
  }

  if (pathname.startsWith('/api/')) {
    const key =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
    const existing = hits.get(key);
    const now = Date.now();
    if (
      !existing ||
      now - existing.windowStarted > env.API_RATE_LIMIT_WINDOW_MS
    ) {
      hits.set(key, { count: 1, windowStarted: now });
      return NextResponse.next();
    }

    if (existing.count >= env.API_RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: 'rate_limit_exceeded' },
        { status: 429 },
      );
    }

    existing.count += 1;
    hits.set(key, existing);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
