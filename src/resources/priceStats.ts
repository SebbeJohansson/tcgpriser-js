import type { HttpClient, PremiumOptions } from '../http.js';
import { splitAuthToken, toQueryString } from '../http.js';
import type {
  CardType,
  GradingCompany,
  ItemCondition,
  ItemDailyStats,
  ItemEstimatedValue,
  ItemFullStats,
  ItemStats,
  ItemVariantDailyStats,
  ItemVariantStats,
  ListResponse,
  TopItem,
} from '../types/index.js';

/** Filters shared by `daily()` and `estimatedValues()` — all narrow which product(s) the stats
 * cover; combine as many as you like. */
export interface ProductFilterParams {
  productName?: string;
  technicalName?: string;
  priceChartingId?: string;
  modelNumber?: string;
  /** Category technicalName. */
  category?: string;
  /** Expansion technicalName. */
  expansion?: string;
}

export interface DailyPriceStatsParams extends ProductFilterParams {
  /** `YYYY-MM-DD` */
  startDate?: string;
  /** `YYYY-MM-DD` */
  endDate?: string;
  /** Expansion id (ObjectId) — an alternative to `expansion` (technicalName). */
  expansionId?: string;
  /** Category id (ObjectId) — an alternative to `category` (technicalName). */
  categoryId?: string;
}

export interface EstimatedValuesParams extends ProductFilterParams {
  page?: number;
  limit?: number;
}

export interface TopProductsParams {
  limit?: number;
}

export interface ProductDailyStatsParams {
  authToken?: string;
  /** Number of days to retrieve, from today backwards. Default 30. */
  days?: number;
}

export interface ProductByVariantParams {
  authToken?: string;
  /** Number of days to include in the average calculation. Default 30. */
  days?: number;
}

export interface ProductDailyByVariantParams {
  authToken?: string;
  cardType: CardType;
  /** Required when `cardType` is `'loose'`. */
  condition?: ItemCondition;
  /** Required when `cardType` is `'graded'`. */
  gradingCompany?: GradingCompany;
  /** Required when `cardType` is `'graded'`. */
  grade?: number;
  /** Number of days to retrieve. Default 30. */
  days?: number;
}

export class PriceStatsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /price-stats/daily` — daily average price history, filtered to matching product(s). */
  daily(params: DailyPriceStatsParams = {}): Promise<ListResponse<ItemDailyStats>> {
    return this.http.get(`/price-stats/daily${toQueryString(params)}`);
  }

  /** `GET /price-stats/estimated-values` — current estimated market value, filtered to matching
   * product(s). */
  estimatedValues(params: EstimatedValuesParams = {}): Promise<ListResponse<ItemEstimatedValue>> {
    return this.http.get(`/price-stats/estimated-values${toQueryString(params)}`);
  }

  /** `GET /price-stats/top-products` — items ranked by shop availability (how many shops carry
   * them), not by price. */
  topProducts(params: TopProductsParams = {}): Promise<ListResponse<TopItem>> {
    return this.http.get(`/price-stats/top-products${toQueryString(params)}`);
  }

  /** `GET /price-stats/product/{id}` — daily price history, current estimate, and a variant-count
   * summary for one product. Premium. */
  product(idOrTechnicalName: string, options: PremiumOptions = {}): Promise<ItemStats> {
    return this.http.get(`/price-stats/product/${encodeURIComponent(idOrTechnicalName)}`, options);
  }

  /** `GET /price-stats/product/{id}/full` — everything `product()` has, plus the item's current
   * shop matches. Premium. */
  productFull(idOrTechnicalName: string, options: PremiumOptions = {}): Promise<ItemFullStats> {
    return this.http.get(`/price-stats/product/${encodeURIComponent(idOrTechnicalName)}/full`, options);
  }

  /** `GET /price-stats/product/{id}/daily` — daily price history for one product, with a
   * caller-chosen window. Premium. */
  productDaily(
    idOrTechnicalName: string,
    params: ProductDailyStatsParams = {},
  ): Promise<ItemDailyStats> {
    const [query, authToken] = splitAuthToken(params);
    return this.http.get(
      `/price-stats/product/${encodeURIComponent(idOrTechnicalName)}/daily${toQueryString(query)}`,
      { authToken },
    );
  }

  /** `GET /price-stats/product/{id}/daily-last-30` — daily price history for the last 30 days
   * exactly (no window param, for callers that want a stable cache key). Premium. */
  productDailyLast30(idOrTechnicalName: string, options: PremiumOptions = {}): Promise<ItemDailyStats> {
    return this.http.get(
      `/price-stats/product/${encodeURIComponent(idOrTechnicalName)}/daily-last-30`,
      options,
    );
  }

  /** `GET /price-stats/product/{id}/estimated-value` — current estimated value only. Premium. */
  productEstimatedValue(
    idOrTechnicalName: string,
    options: PremiumOptions = {},
  ): Promise<ItemEstimatedValue> {
    return this.http.get(
      `/price-stats/product/${encodeURIComponent(idOrTechnicalName)}/estimated-value`,
      options,
    );
  }

  /** `GET /price-stats/product/{id}/by-variant` — price stats broken out per card condition/grade.
   * Premium. */
  productByVariant(
    idOrTechnicalName: string,
    params: ProductByVariantParams = {},
  ): Promise<ItemVariantStats> {
    const [query, authToken] = splitAuthToken(params);
    return this.http.get(
      `/price-stats/product/${encodeURIComponent(idOrTechnicalName)}/by-variant${toQueryString(query)}`,
      { authToken },
    );
  }

  /** `GET /price-stats/product/{id}/daily-by-variant` — daily price history for one specific
   * condition/grade. `condition` is required for `cardType: 'loose'`; `gradingCompany` and `grade`
   * are required for `cardType: 'graded'`. Premium. */
  productDailyByVariant(
    idOrTechnicalName: string,
    params: ProductDailyByVariantParams,
  ): Promise<ItemVariantDailyStats> {
    const [query, authToken] = splitAuthToken(params);
    return this.http.get(
      `/price-stats/product/${encodeURIComponent(idOrTechnicalName)}/daily-by-variant${toQueryString(query)}`,
      { authToken },
    );
  }
}
