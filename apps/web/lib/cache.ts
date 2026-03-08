type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const store = new Map<string, CacheEntry<unknown>>();

export const getCached = async <T>(
  key: string,
  ttlMs: number,
  factory: () => Promise<T>,
): Promise<T> => {
  const now = Date.now();
  const existing = store.get(key);

  if (existing && existing.expiresAt > now) {
    return existing.value as T;
  }

  const value = await factory();
  store.set(key, {
    value,
    expiresAt: now + ttlMs,
  });
  return value;
};
