import type { ProviderAdapter } from './interfaces';

export class ProviderRegistry {
  private readonly adapters = new Map<string, ProviderAdapter>();

  register(adapter: ProviderAdapter) {
    this.adapters.set(adapter.slug, adapter);
  }

  registerMany(adapters: ProviderAdapter[]) {
    for (const adapter of adapters) {
      this.register(adapter);
    }
  }

  get(slug: string) {
    return this.adapters.get(slug);
  }

  list() {
    return [...this.adapters.values()];
  }
}
