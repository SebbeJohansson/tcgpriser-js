import type { HttpClient, PremiumOptions } from '../http.js';
import type { Expansion, ExpansionContents, ExpansionLivePricing } from '../types/index.js';

export class ExpansionsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /expansions`: every expansion. Unwrapped to a plain array, nothing to paginate here. */
  async list(): Promise<Expansion[]> {
    const res = await this.http.get<{ data: Expansion[] }>('/expansions');
    return res.data;
  }

  /** `GET /expansions/{technicalName}/products`: every card and sealed product in one
   * expansion, kept as separate `cards`/`sealed` groups. */
  products(technicalName: string): Promise<ExpansionContents> {
    return this.http.get(`/expansions/${encodeURIComponent(technicalName)}/products?grouped=true`);
  }

  /** `GET /expansions/{technicalName}/products/live-pricing`: computed fresh for every item in
   * this expansion, not read from the last stats job. Premium. */
  livePricing(technicalName: string, options: PremiumOptions = {}): Promise<ExpansionLivePricing> {
    return this.http.get(
      `/expansions/${encodeURIComponent(technicalName)}/products/live-pricing`,
      options,
    );
  }
}
