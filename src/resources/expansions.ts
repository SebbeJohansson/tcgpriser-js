import type { HttpClient, RequestOptions } from '../http.js';
import { splitRequestOptions, toQueryString } from '../http.js';
import type {
  Card,
  Expansion,
  ExpansionLivePricing,
  ExpansionRef,
  ExpansionReleaseGroup,
  ListResponse,
  SealedProduct,
} from '../types/index.js';

export interface ListExpansionsParams extends RequestOptions {
  /** Brand `id` or technicalName, e.g. `'pokemon'`. An unrecognized value is a 400, not an empty
   * list. */
  brand?: string;
}

export class ExpansionsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /expansions`: every expansion. Unwrapped to a plain array, nothing to paginate here. */
  async list(params: ListExpansionsParams = {}): Promise<Expansion[]> {
    const [query, requestOptions] = splitRequestOptions(params);
    const res = await this.http.get<{ data: Expansion[] }>(
      `/expansions${toQueryString(query)}`,
      requestOptions,
    );
    return res.data;
  }

  /** `GET /expansions/{technicalName}`: metadata only — no cards or sealed products. Returns the
   * smaller `ExpansionRef`, not the full `Expansion`: this is a plain lookup by technicalName, not
   * the aggregation `list()` runs, so `sealedCount`/`cardCount`/`productCount` aren't available
   * here. See `cards()` and `sealedProducts()` for this expansion's contents. */
  get(technicalName: string, options: RequestOptions = {}): Promise<ExpansionRef> {
    return this.http.get(`/expansions/${encodeURIComponent(technicalName)}`, options);
  }

  /** `GET /expansions/{technicalName}/cards`: every card in this expansion. Content only, no
   * pricing fields — pass the `id`s from the result to `client.cards.pricingBatch()` if you need
   * pricing too. Sealed products are a separate call — see `sealedProducts()` — never merged into
   * this one. */
  cards(technicalName: string, options: RequestOptions = {}): Promise<ListResponse<Card>> {
    return this.http.get(`/expansions/${encodeURIComponent(technicalName)}/cards`, options);
  }

  /** `GET /expansions/{technicalName}/release-group`: the other expansions in this expansion's
   * release group (e.g. a core set's variant drops), excluding the requested expansion itself. */
  releaseGroup(
    technicalName: string,
    options: RequestOptions = {},
  ): Promise<ExpansionReleaseGroup> {
    return this.http.get(`/expansions/${encodeURIComponent(technicalName)}/release-group`, options);
  }

  /** `GET /expansions/{technicalName}/products`: every sealed product in this expansion. Content
   * only, no pricing fields — pass the `id`s from the result to `client.products.pricingBatch()`
   * if you need pricing too. Cards are a separate call — see `cards()` — never merged into this
   * one. */
  sealedProducts(
    technicalName: string,
    options: RequestOptions = {},
  ): Promise<ListResponse<SealedProduct>> {
    return this.http.get(`/expansions/${encodeURIComponent(technicalName)}/products`, options);
  }

  /** `GET /expansions/{technicalName}/cards/live-pricing`: computed fresh for every card in this
   * expansion, not read from the last stats job. Premium. */
  cardsLivePricing(
    technicalName: string,
    options: RequestOptions = {},
  ): Promise<ExpansionLivePricing> {
    return this.http.get(
      `/expansions/${encodeURIComponent(technicalName)}/cards/live-pricing`,
      options,
    );
  }

  /** `GET /expansions/{technicalName}/products/live-pricing`: computed fresh for every sealed
   * product in this expansion, not read from the last stats job. Premium. */
  productsLivePricing(
    technicalName: string,
    options: RequestOptions = {},
  ): Promise<ExpansionLivePricing> {
    return this.http.get(
      `/expansions/${encodeURIComponent(technicalName)}/products/live-pricing`,
      options,
    );
  }
}
