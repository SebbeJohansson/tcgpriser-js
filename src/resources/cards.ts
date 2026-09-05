import type { HttpClient, RequestOptions } from '../http.js';
import { splitRequestOptions, toQueryString } from '../http.js';
import type {
  Card,
  CardType,
  CatalogItemPricing,
  CatalogSlug,
  ItemReferencePrices,
  ItemShopMatches,
  ItemSoldPrices,
  ItemDailyStats,
  ItemEstimatedValue,
  ListResponse,
  LivePricingForItem,
  PaginationParams,
  ReferencePriceCardVariant,
  ReferencePriceProvider,
} from '../types/index.js';

export interface ListCardsParams extends PaginationParams {}

export interface SearchCardsParams extends PaginationParams {
  /** Free-text search over card and set names. */
  search?: string;
}

export interface CardMatchesParams extends PaginationParams {
  /** Keep only matches whose shop currently has stock. */
  inStock?: boolean;
}

export interface CardReferencePricesParams extends RequestOptions {
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

export interface CardPricesParams extends PaginationParams {}

/** Filters for `cards.dailyStats()`. Narrow to one card, or to a whole expansion/category. */
export interface CardDailyStatsParams extends RequestOptions {
  /** `YYYY-MM-DD` */
  startDate?: string;
  /** `YYYY-MM-DD` */
  endDate?: string;
  productName?: string;
  technicalName?: string;
  /** Category technicalName. */
  category?: string;
  /** Expansion technicalName. */
  expansion?: string;
  /** Category id (ObjectId), an alternative to `category`. */
  categoryId?: string;
  /** Expansion id (ObjectId), an alternative to `expansion`. */
  expansionId?: string;
}

/** Filters for `cards.estimatedValues()`. Note `page`/`limit`, not the `limit`/`skip` the rest of
 * the API paginates with — this endpoint predates that convention. */
export interface CardEstimatedValuesParams extends RequestOptions {
  page?: number;
  limit?: number;
  productName?: string;
  technicalName?: string;
  /** Category technicalName. */
  category?: string;
  /** Expansion technicalName. */
  expansion?: string;
}

export class CardsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /cards`: list cards, newest first. No free-text search — use `search()` for that. */
  list(params: ListCardsParams = {}): Promise<ListResponse<Card>> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(`/cards${toQueryString(query)}`, requestOptions);
  }

  /** `GET /cards/search`: like `list()`, but with free-text search on card and set names. Premium. */
  search(params: SearchCardsParams = {}): Promise<ListResponse<Card>> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(`/cards/search${toQueryString(query)}`, requestOptions);
  }

  /** `GET /cards/{id}`: fetch one card by its id or technicalName. */
  get(idOrTechnicalName: string, options: RequestOptions = {}): Promise<Card> {
    return this.http.get(`/cards/${encodeURIComponent(idOrTechnicalName)}`, options);
  }

  /** `GET /cards/{id}/matches`: current shop listings matched to this card (latest per shop). */
  matches(idOrTechnicalName: string, params: CardMatchesParams = {}): Promise<ItemShopMatches> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(
      `/cards/${encodeURIComponent(idOrTechnicalName)}/matches${toQueryString(query)}`,
      requestOptions,
    );
  }

  /** `GET /cards/{id}/reference-prices`: Cardmarket/TCGplayer/eBay/Tradera price history. Premium. */
  referencePrices(
    idOrTechnicalName: string,
    params: CardReferencePricesParams = {},
  ): Promise<ItemReferencePrices> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(
      `/cards/${encodeURIComponent(idOrTechnicalName)}/reference-prices${toQueryString(query)}`,
      requestOptions,
    );
  }

  /** `GET /cards/{id}/prices`: individual marketplace sale records. Premium. */
  prices(idOrTechnicalName: string, params: CardPricesParams = {}): Promise<ItemSoldPrices> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(`/cards/${encodeURIComponent(idOrTechnicalName)}/prices${toQueryString(query)}`, requestOptions);
  }

  /** `GET /cards/{id}/pricing/live`: computed fresh for this request, not read from the last
   * stats job. Premium. */
  livePricing(idOrTechnicalName: string, options: RequestOptions = {}): Promise<LivePricingForItem> {
    return this.http.get(`/cards/${encodeURIComponent(idOrTechnicalName)}/pricing/live`, options);
  }

  /** `GET /cards/{id}/pricing`: this card's current pricing snapshot — `retailPrice`,
   * `estimatedValue`, `lowestShopOffer`, `referencePriceSnapshotsByProvider` — refreshed once a day
   * by the nightly pricing/scraper jobs. `get()` returns content only; this is the separate,
   * shorter-cached call for the part of a card that actually changes day to day. */
  pricing(idOrTechnicalName: string, options: RequestOptions = {}): Promise<CatalogItemPricing> {
    return this.http.get(`/cards/${encodeURIComponent(idOrTechnicalName)}/pricing`, options);
  }

  /** `GET /cards/pricing`: pricing for up to 200 cards in one request, keyed by `id` — the batch
   * counterpart to `pricing()`, for a page of results (a search page, an expansion's contents) that
   * needs pricing for many items at once. Unlike `get()`/`pricing()`, this only accepts `id`s, not
   * technicalNames — pass the `id`s already on the cards you fetched. Ids with no match are
   * silently omitted from the result rather than causing an error. */
  pricingBatch(
    ids: string[],
    options: RequestOptions = {},
  ): Promise<ListResponse<CatalogItemPricing>> {
    return this.http.get(`/cards/pricing?ids=${ids.map(encodeURIComponent).join(',')}`, options);
  }

  /** `GET /cards/technical-names`: every card's `technicalName` and `updatedAt`, unpaginated and
   * with no pricing joins. Built for enumerating the whole catalog cheaply — a sitemap, or working
   * out which items changed since your last sync — where `list()` would make you page through full
   * card documents to learn the same two fields. */
  technicalNames(options: RequestOptions = {}): Promise<ListResponse<CatalogSlug>> {
    return this.http.get('/cards/technical-names', options);
  }

  /** `GET /cards/price-stats/daily`: daily average price history, cards only. The same data as
   * `client.priceStats.daily()`, scoped to the card catalog so a filter like `expansion` can't pull
   * in that expansion's sealed products too. */
  dailyStats(params: CardDailyStatsParams = {}): Promise<ListResponse<ItemDailyStats>> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(`/cards/price-stats/daily${toQueryString(query)}`, requestOptions);
  }

  /** `GET /cards/price-stats/estimated-values`: current estimated market value, cards only. The
   * card-scoped counterpart to `client.priceStats.estimatedValues()`. */
  estimatedValues(
    params: CardEstimatedValuesParams = {},
  ): Promise<ListResponse<ItemEstimatedValue>> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(
      `/cards/price-stats/estimated-values${toQueryString(query)}`,
      requestOptions,
    );
  }
}
