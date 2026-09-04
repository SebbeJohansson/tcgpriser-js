import type { HttpClient, RequestOptions } from '../http.js';
import { splitRequestOptions, toQueryString } from '../http.js';
import type {
  CardType,
  CatalogItemPricing,
  CatalogSlug,
  GradingCompany,
  ItemCondition,
  ItemDailyStats,
  ItemEstimatedValue,
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

export interface ProductReferencePricesParams extends RequestOptions {
  authToken?: string;
  /** Rolling window ending today, in days. Ignored when `from`/`to` are supplied. Default 90. */
  days?: number;
  /** `YYYY-MM-DD` */
  from?: string;
  /** `YYYY-MM-DD` */
  to?: string;
  provider?: ReferencePriceProvider;
}

export interface ProductPricesParams extends PaginationParams {}

/** Filters for `products.dailyStats()`. Narrow to one product, or to a whole expansion/category. */
export interface ProductDailyPriceStatsParams extends RequestOptions {
  /** `YYYY-MM-DD` */
  startDate?: string;
  /** `YYYY-MM-DD` */
  endDate?: string;
  productName?: string;
  technicalName?: string;
  priceChartingId?: string;
  modelNumber?: string;
  /** Category technicalName. */
  category?: string;
  /** Expansion technicalName. */
  expansion?: string;
  /** Category id (ObjectId), an alternative to `category`. */
  categoryId?: string;
  /** Expansion id (ObjectId), an alternative to `expansion`. */
  expansionId?: string;
}

/** Filters for `products.estimatedValues()`. Note `page`/`limit`, not the `limit`/`skip` the rest
 * of the API paginates with — this endpoint predates that convention. */
export interface ProductEstimatedValuesParams extends RequestOptions {
  page?: number;
  limit?: number;
  productName?: string;
  technicalName?: string;
  priceChartingId?: string;
  modelNumber?: string;
  /** Category technicalName. */
  category?: string;
  /** Expansion technicalName. */
  expansion?: string;
}

/** Sealed products: booster boxes, ETBs, tins, and the like. Single cards live under
 * `client.cards` instead. */
export class ProductsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /product`: search or list sealed products. */
  list(params: ListProductsParams = {}): Promise<ListResponse<SealedProduct>> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(`/product${toQueryString(query)}`, requestOptions);
  }

  /** `GET /product/{id}`: fetch one sealed product by its id or technicalName. */
  get(idOrTechnicalName: string, options: RequestOptions = {}): Promise<SealedProduct> {
    return this.http.get(`/product/${encodeURIComponent(idOrTechnicalName)}`, options);
  }

  /** `GET /product/{id}/matches`: current shop listings matched to this product (latest per shop). */
  matches(idOrTechnicalName: string, params: ProductMatchesParams = {}): Promise<ItemShopMatches> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(
      `/product/${encodeURIComponent(idOrTechnicalName)}/matches${toQueryString(query)}`,
      requestOptions,
    );
  }

  /** `GET /product/{id}/reference-prices`: Cardmarket/TCGplayer/Tradera price history. Premium. */
  referencePrices(
    idOrTechnicalName: string,
    params: ProductReferencePricesParams = {},
  ): Promise<ItemReferencePrices> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(
      `/product/${encodeURIComponent(idOrTechnicalName)}/reference-prices${toQueryString(query)}`,
      requestOptions,
    );
  }

  /** `GET /product/{id}/prices`: individual marketplace sale records. Premium. */
  prices(idOrTechnicalName: string, params: ProductPricesParams = {}): Promise<ItemSoldPrices> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(
      `/product/${encodeURIComponent(idOrTechnicalName)}/prices${toQueryString(query)}`,
      requestOptions,
    );
  }

  /** `GET /product/{id}/pricing/live`: computed fresh for this request, not read from the last
   * stats job. Premium. */
  livePricing(idOrTechnicalName: string, options: RequestOptions = {}): Promise<LivePricingForItem> {
    return this.http.get(`/product/${encodeURIComponent(idOrTechnicalName)}/pricing/live`, options);
  }

  /** `GET /product/{id}/pricing`: this product's current pricing snapshot — `retailPrice`,
   * `estimatedValue`, `lowestShopOffer`, `referencePriceSnapshotsByProvider` — refreshed once a day
   * by the nightly pricing/scraper jobs. `get()` returns content only; this is the separate,
   * shorter-cached call for the part of a product that actually changes day to day. */
  pricing(idOrTechnicalName: string, options: RequestOptions = {}): Promise<CatalogItemPricing> {
    return this.http.get(`/product/${encodeURIComponent(idOrTechnicalName)}/pricing`, options);
  }

  /** `GET /product/pricing`: pricing for up to 200 sealed products in one request, keyed by `id` —
   * the batch counterpart to `pricing()`, for a page of results (a search page, an expansion's
   * contents) that needs pricing for many items at once. Unlike `get()`/`pricing()`, this only
   * accepts `id`s, not technicalNames — pass the `id`s already on the products you fetched. Ids with
   * no match are silently omitted from the result rather than causing an error. */
  pricingBatch(
    ids: string[],
    options: RequestOptions = {},
  ): Promise<ListResponse<CatalogItemPricing>> {
    return this.http.get(`/product/pricing?ids=${ids.map(encodeURIComponent).join(',')}`, options);
  }

  /** `GET /product/technical-names`: every sealed product's `technicalName` and `updatedAt`,
   * unpaginated and with no pricing joins. The sealed counterpart to
   * `client.cards.technicalNames()` — for sitemaps and incremental syncs. */
  technicalNames(options: RequestOptions = {}): Promise<ListResponse<CatalogSlug>> {
    return this.http.get('/product/technical-names', options);
  }

  /** `GET /product/price-stats/daily`: daily average price history, sealed products only. The same
   * data as `client.priceStats.daily()`, scoped to the sealed catalog so a filter like `expansion`
   * can't pull in that expansion's single cards too. */
  dailyStats(params: ProductDailyPriceStatsParams = {}): Promise<ListResponse<ItemDailyStats>> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(`/product/price-stats/daily${toQueryString(query)}`, requestOptions);
  }

  /** `GET /product/price-stats/estimated-values`: current estimated market value, sealed products
   * only. The sealed-scoped counterpart to `client.priceStats.estimatedValues()`. */
  estimatedValues(
    params: ProductEstimatedValuesParams = {},
  ): Promise<ListResponse<ItemEstimatedValue>> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(
      `/product/price-stats/estimated-values${toQueryString(query)}`,
      requestOptions,
    );
  }
}
