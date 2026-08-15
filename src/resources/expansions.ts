import type { HttpClient, PremiumOptions } from '../http.js';
import type { Expansion, ExpansionContents, ExpansionLivePricing } from '../types/index.js';

export class ExpansionsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /expansions` — every expansion. Unwrapped to a plain array: the set is small and
   * returned in full, there's nothing to paginate. */
  async list(): Promise<Expansion[]> {
    const res = await this.http.get<{ data: Expansion[] }>('/expansions');
    return res.data;
  }

  /** `GET /expansions/{technicalName}/products` — every card and sealed product in one expansion,
   * kept as separate `cards`/`sealed` groups rather than merged into one mixed list. */
  products(technicalName: string): Promise<ExpansionContents> {
    return this.http.get(`/expansions/${encodeURIComponent(technicalName)}/products?grouped=true`);
  }

  /** `GET /expansions/{technicalName}/products/live-pricing` — pricing computed fresh for every
   * item in this expansion, rather than read from the last stats job. Premium. */
  livePricing(technicalName: string, options: PremiumOptions = {}): Promise<ExpansionLivePricing> {
    return this.http.get(
      `/expansions/${encodeURIComponent(technicalName)}/products/live-pricing`,
      options,
    );
  }
}
