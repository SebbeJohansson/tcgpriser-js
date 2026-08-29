import type { HttpClient, PremiumOptions } from '../http.js';
import { splitAuthToken, toQueryString } from '../http.js';
import type {
  Card,
  CardType,
  CatalogItemPricing,
  ItemReferencePrices,
  ItemShopMatches,
  ItemSoldPrices,
  ListResponse,
  LivePricingForItem,
  PaginationParams,
  ReferencePriceCardVariant,
  ReferencePriceProvider,
} from '../types/index.js';

export interface ListCardsParams extends PaginationParams {
  /** Free-text search over card and set names. */
  search?: string;
}

export interface CardMatchesParams extends PaginationParams {
  /** Keep only matches whose shop currently has stock. */
  inStock?: boolean;
}

export interface CardReferencePricesParams {
  /** Bearer token for this call. Overrides the client's default `authToken`. */
  authToken?: string;
  /** Rolling window ending today, in days. Ignored when `from`/`to` are supplied. Default 90. */
  days?: number;
  /** `YYYY-MM-DD` */
  from?: string;
  /** `YYYY-MM-DD` */
  to?: string;
  provider?: ReferencePriceProvider;
  cardType?: CardType;
  variant?: ReferencePriceCardVariant;
}

export interface CardPricesParams extends PaginationParams {
  authToken?: string;
}

export class CardsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /cards`: search or list cards. */
  list(params: ListCardsParams = {}): Promise<ListResponse<Card>> {
    return this.http.get(`/cards${toQueryString(params)}`);
  }

  /** `GET /cards/{id}`: fetch one card by its id or technicalName. */
  get(idOrTechnicalName: string): Promise<Card> {
    return this.http.get(`/cards/${encodeURIComponent(idOrTechnicalName)}`);
  }

  /** `GET /cards/{id}/matches`: current shop listings matched to this card (latest per shop). */
  matches(idOrTechnicalName: string, params: CardMatchesParams = {}): Promise<ItemShopMatches> {
    return this.http.get(
      `/cards/${encodeURIComponent(idOrTechnicalName)}/matches${toQueryString(params)}`,
    );
  }

  /** `GET /cards/{id}/reference-prices`: Cardmarket/TCGplayer/eBay/Tradera price history. Premium. */
  referencePrices(
    idOrTechnicalName: string,
    params: CardReferencePricesParams = {},
  ): Promise<ItemReferencePrices> {
    const [query, authToken] = splitAuthToken(params);
    return this.http.get(
      `/cards/${encodeURIComponent(idOrTechnicalName)}/reference-prices${toQueryString(query)}`,
      { authToken },
    );
  }

  /** `GET /cards/{id}/prices`: individual marketplace sale records. Premium. */
  prices(idOrTechnicalName: string, params: CardPricesParams = {}): Promise<ItemSoldPrices> {
    const [query, authToken] = splitAuthToken(params);
    return this.http.get(`/cards/${encodeURIComponent(idOrTechnicalName)}/prices${toQueryString(query)}`, {
      authToken,
    });
  }

  /** `GET /cards/{id}/pricing/live`: computed fresh for this request, not read from the last
   * stats job. Premium. */
  livePricing(idOrTechnicalName: string, options: PremiumOptions = {}): Promise<LivePricingForItem> {
    return this.http.get(`/cards/${encodeURIComponent(idOrTechnicalName)}/pricing/live`, options);
  }

  /** `GET /cards/{id}/pricing`: this card's current pricing snapshot — `retailPrice`,
   * `estimatedValue`, `lowestShopOffer`, `referencePriceSnapshotsByProvider` — refreshed once a day
   * by the nightly pricing/scraper jobs. `get()` returns content only; this is the separate,
   * shorter-cached call for the part of a card that actually changes day to day. */
  pricing(idOrTechnicalName: string): Promise<CatalogItemPricing> {
    return this.http.get(`/cards/${encodeURIComponent(idOrTechnicalName)}/pricing`);
  }

  /** `GET /cards/pricing`: pricing for up to 200 cards in one request, keyed by `id` — the batch
   * counterpart to `pricing()`, for a page of results (a search page, an expansion's contents) that
   * needs pricing for many items at once. Unlike `get()`/`pricing()`, this only accepts `id`s, not
   * technicalNames — pass the `id`s already on the cards you fetched. Ids with no match are
   * silently omitted from the result rather than causing an error. */
  pricingBatch(ids: string[]): Promise<ListResponse<CatalogItemPricing>> {
    return this.http.get(`/cards/pricing?ids=${ids.map(encodeURIComponent).join(',')}`);
  }
}
