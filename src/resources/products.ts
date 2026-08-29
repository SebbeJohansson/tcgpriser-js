import type { HttpClient, PremiumOptions } from '../http.js';
import { splitAuthToken, toQueryString } from '../http.js';
import type {
  CardType,
  CatalogItemPricing,
  GradingCompany,
  ItemCondition,
  ItemReferencePrices,
  ItemShopMatches,
  ItemSoldPrices,
  ListResponse,
  LivePricingForItem,
  PaginationParams,
  ReferencePriceProvider,
  SealedProduct,
} from '../types/index.js';

export interface ListProductsParams extends PaginationParams {
  /** Whitespace-separated tokens, each matched against the start of a word. */
  search?: string;
}

export interface ProductMatchesParams extends PaginationParams {
  /** Keep only matches whose shop currently has stock. */
  inStock?: boolean;
  cardType?: CardType;
  condition?: ItemCondition;
  gradingCompany?: GradingCompany;
  grade?: number;
}

export interface ProductReferencePricesParams {
  authToken?: string;
  /** Rolling window ending today, in days. Ignored when `from`/`to` are supplied. Default 90. */
  days?: number;
  /** `YYYY-MM-DD` */
  from?: string;
  /** `YYYY-MM-DD` */
  to?: string;
  provider?: ReferencePriceProvider;
}

export interface ProductPricesParams extends PaginationParams {
  authToken?: string;
}

/** Sealed products: booster boxes, ETBs, tins, and the like. Single cards live under
 * `client.cards` instead. */
export class ProductsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /product`: search or list sealed products. */
  list(params: ListProductsParams = {}): Promise<ListResponse<SealedProduct>> {
    return this.http.get(`/product${toQueryString(params)}`);
  }

  /** `GET /product/{id}`: fetch one sealed product by its id or technicalName. */
  get(idOrTechnicalName: string): Promise<SealedProduct> {
    return this.http.get(`/product/${encodeURIComponent(idOrTechnicalName)}`);
  }

  /** `GET /product/{id}/matches`: current shop listings matched to this product (latest per shop). */
  matches(idOrTechnicalName: string, params: ProductMatchesParams = {}): Promise<ItemShopMatches> {
    return this.http.get(
      `/product/${encodeURIComponent(idOrTechnicalName)}/matches${toQueryString(params)}`,
    );
  }

  /** `GET /product/{id}/reference-prices`: Cardmarket/TCGplayer/Tradera price history. Premium. */
  referencePrices(
    idOrTechnicalName: string,
    params: ProductReferencePricesParams = {},
  ): Promise<ItemReferencePrices> {
    const [query, authToken] = splitAuthToken(params);
    return this.http.get(
      `/product/${encodeURIComponent(idOrTechnicalName)}/reference-prices${toQueryString(query)}`,
      { authToken },
    );
  }

  /** `GET /product/{id}/prices`: individual marketplace sale records. Premium. */
  prices(idOrTechnicalName: string, params: ProductPricesParams = {}): Promise<ItemSoldPrices> {
    const [query, authToken] = splitAuthToken(params);
    return this.http.get(
      `/product/${encodeURIComponent(idOrTechnicalName)}/prices${toQueryString(query)}`,
      { authToken },
    );
  }

  /** `GET /product/{id}/pricing/live`: computed fresh for this request, not read from the last
   * stats job. Premium. */
  livePricing(idOrTechnicalName: string, options: PremiumOptions = {}): Promise<LivePricingForItem> {
    return this.http.get(`/product/${encodeURIComponent(idOrTechnicalName)}/pricing/live`, options);
  }

  /** `GET /product/{id}/pricing`: this product's current pricing snapshot — `retailPrice`,
   * `estimatedValue`, `lowestShopOffer`, `referencePriceSnapshotsByProvider` — refreshed once a day
   * by the nightly pricing/scraper jobs. `get()` returns content only; this is the separate,
   * shorter-cached call for the part of a product that actually changes day to day. */
  pricing(idOrTechnicalName: string): Promise<CatalogItemPricing> {
    return this.http.get(`/product/${encodeURIComponent(idOrTechnicalName)}/pricing`);
  }

  /** `GET /product/pricing`: pricing for up to 200 sealed products in one request, keyed by `id` —
   * the batch counterpart to `pricing()`, for a page of results (a search page, an expansion's
   * contents) that needs pricing for many items at once. Unlike `get()`/`pricing()`, this only
   * accepts `id`s, not technicalNames — pass the `id`s already on the products you fetched. Ids with
   * no match are silently omitted from the result rather than causing an error. */
  pricingBatch(ids: string[]): Promise<ListResponse<CatalogItemPricing>> {
    return this.http.get(`/product/pricing?ids=${ids.map(encodeURIComponent).join(',')}`);
  }
}
