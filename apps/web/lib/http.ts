import { NextResponse } from 'next/server';

export const apiJson = <T>(data: T, init?: ResponseInit) =>
  NextResponse.json(
    {
      data,
      meta: {
        generatedAt: new Date().toISOString(),
        count: Array.isArray(data) ? data.length : undefined,
      },
    },
    init,
  );
