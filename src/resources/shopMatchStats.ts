import type { HttpClient, RequestOptions } from '../http.js';
import { splitRequestOptions, toQueryString } from '../http.js';
import type { ItemPriceComparison, ItemShopPriceHistory, ShopPriceHistoryList } from '../types/index.js';

export interface ShopMatchStatsForProductParams extends RequestOptions {
  /** `YYYY-MM-DD` */
  startDate?: string;
  /** `YYYY-MM-DD` */
  endDate?: string;
  /** Filter to one shop's technicalName. */
  shop?: string;
}

export interface ShopMatchStatsForShopParams extends RequestOptions {
  /** `YYYY-MM-DD` */
  startDate?: string;
  /** `YYYY-MM-DD` */
  endDate?: string;
  /** Maximum products to return. Default 20, max 50. */
  limit?: number;
}

export interface CompareShopPricesParams extends RequestOptions {
  /** Product/card id or technicalName. */
  productId: string;
  /** `YYYY-MM-DD`: defaults to the latest date with data. */
  date?: string;
}

/** Historical shop-vs-price data, distinct from `client.shopMatches` (which is the current/latest
 * match state). Everything here is premium. */
export class ShopMatchStatsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /shop-match-stats/product/{productId}`: one product's price history, broken out per shop. */
  forProduct(
    productId: string,
    params: ShopMatchStatsForProductParams = {},
  ): Promise<ItemShopPriceHistory> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(
      `/shop-match-stats/product/${encodeURIComponent(productId)}${toQueryString(query)}`,
      requestOptions,
    );
  }

  /** `GET /shop-match-stats/shop/{shop}`: one shop's price history, broken out per product. */
  forShop(shop: string, params: ShopMatchStatsForShopParams = {}): Promise<ShopPriceHistoryList> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(`/shop-match-stats/shop/${encodeURIComponent(shop)}${toQueryString(query)}`, requestOptions);
  }

  /** `GET /shop-match-stats/compare`: one product's price at every shop that carries it, as of
   * one date (defaults to the latest). */
  compare(params: CompareShopPricesParams): Promise<ItemPriceComparison> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(`/shop-match-stats/compare${toQueryString(query)}`, requestOptions);
  }
}
