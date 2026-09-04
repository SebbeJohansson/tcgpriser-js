import type { HttpClient, RequestOptions } from '../http.js';
import { splitRequestOptions, toQueryString } from '../http.js';
import type { ListResponse, PaginationParams, ShopMatch, ShopMatchesForShop, ShopMatchStats } from '../types/index.js';

export interface ListShopMatchesParams extends PaginationParams {
  /** Filter to one shop's technicalName. */
  shop?: string;
  inStock?: boolean;
  /** Filter by whether the listing has been resolved to a catalog item. */
  linked?: boolean;
}

export interface ShopMatchesForShopParams extends PaginationParams {
  inStock?: boolean;
}

/** Raw shop-to-catalog match data: what's currently listed where, independent of which item or
 * shop you start from. For "what does this card cost at each shop" or "what's in stock at this
 * shop", prefer `client.cards.matches()` / `client.products.matches()` /
 * `client.shopMatches.forShop()`. */
export class ShopMatchesResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /shop-matches`: every current match across every shop (latest record per url+shop). */
  list(params: ListShopMatchesParams = {}): Promise<ListResponse<ShopMatch>> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(`/shop-matches${toQueryString(query)}`, requestOptions);
  }

  /** `GET /shop-matches/{shop}`: every current match at one shop (latest record per url). */
  forShop(technicalName: string, params: ShopMatchesForShopParams = {}): Promise<ShopMatchesForShop> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(
      `/shop-matches/${encodeURIComponent(technicalName)}${toQueryString(query)}`,
      requestOptions,
    );
  }

  /** `GET /shop-matches/shops`: match counts per shop (based on latest records only). */
  shopStats(params: PaginationParams = {}): Promise<ListResponse<ShopMatchStats>> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(`/shop-matches/shops${toQueryString(query)}`, requestOptions);
  }
}
