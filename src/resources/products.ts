import type { HttpClient, PremiumOptions } from '../http.js';
import { splitAuthToken, toQueryString } from '../http.js';
import type {
  CardType,
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

/** Sealed products — booster boxes, ETBs, tins, and the like. Single cards live under
 * `client.cards` instead. */
export class ProductsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /product` — search or list sealed products. */
  list(params: ListProductsParams = {}): Promise<ListResponse<SealedProduct>> {
    return this.http.get(`/product${toQueryString(params)}`);
  }

  /** `GET /product/{id}` — fetch one sealed product by its id or technicalName. */
  get(idOrTechnicalName: string): Promise<SealedProduct> {
    return this.http.get(`/product/${encodeURIComponent(idOrTechnicalName)}`);
  }

  /** `GET /product/{id}/matches` — current shop listings matched to this product (latest per shop). */
  matches(idOrTechnicalName: string, params: ProductMatchesParams = {}): Promise<ItemShopMatches> {
    return this.http.get(
      `/product/${encodeURIComponent(idOrTechnicalName)}/matches${toQueryString(params)}`,
    );
  }

  /** `GET /product/{id}/reference-prices` — Cardmarket/TCGplayer/Tradera price history. Premium. */
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

  /** `GET /product/{id}/prices` — individual marketplace sale records. Premium. */
  prices(idOrTechnicalName: string, params: ProductPricesParams = {}): Promise<ItemSoldPrices> {
    const [query, authToken] = splitAuthToken(params);
    return this.http.get(
      `/product/${encodeURIComponent(idOrTechnicalName)}/prices${toQueryString(query)}`,
      { authToken },
    );
  }

  /** `GET /product/{id}/pricing/live` — pricing computed fresh for this request, rather than read
   * from the last stats job. Premium. */
  livePricing(idOrTechnicalName: string, options: PremiumOptions = {}): Promise<LivePricingForItem> {
    return this.http.get(`/product/${encodeURIComponent(idOrTechnicalName)}/pricing/live`, options);
  }
}
