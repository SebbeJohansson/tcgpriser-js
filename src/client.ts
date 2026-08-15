import { HttpClient } from './http.js';
import { BargainsResource } from './resources/bargains.js';
import { CardsResource } from './resources/cards.js';
import { ExpansionsResource } from './resources/expansions.js';
import { PackRatesResource } from './resources/packRates.js';
import { PriceStatsResource } from './resources/priceStats.js';
import { ProductsResource } from './resources/products.js';
import { ShopMatchStatsResource } from './resources/shopMatchStats.js';
import { ShopMatchesResource } from './resources/shopMatches.js';
import { ShopUrlsResource } from './resources/shopUrls.js';
import { ShopsResource } from './resources/shops.js';
import { StatsResource } from './resources/stats.js';

export const DEFAULT_BASE_URL = 'https://api.tcgpriser.se';

/**
 * Escape hatches for local dev, testing and self-hosting — not something a normal integration
 * needs. Nested under `advanced` rather than sitting next to `authToken` so the constructor reads
 * as "here's your token" first and "here's how to point this somewhere else" a clear second.
 */
export interface TcgPriserAdvancedOptions {
  /** Override the API host — for a local dev server (`http://localhost:5000`) or a self-hosted
   * instance. Defaults to the production API; you don't need this to talk to tcgpriser.se. */
  baseUrl?: string;
  /** Extra headers sent on every request, e.g. a custom `User-Agent`. */
  headers?: Record<string, string>;
  /** Override the `fetch` implementation (older Node, testing, a proxying agent). Defaults to the
   * global `fetch`. */
  fetch?: typeof fetch;
}

export interface TcgPriserOptions {
  /**
   * A signed-in subscriber's JWT. Only needed for premium methods (`cards.prices()`,
   * `priceStats.product()`, `bargains.search()`, etc. — see each resource's docs for which ones);
   * every public method works without it. Obtained however your own app authenticates against
   * tcgpriser.se — this client has no login flow of its own.
   *
   * Every premium method also accepts its own `authToken` to override this per call, which is the
   * better fit when one server-side client instance is shared across multiple signed-in users'
   * requests rather than acting as a single user.
   */
  authToken?: string;
  /** Local dev / self-hosting / testing overrides. Leave unset unless you know you need it. */
  advanced?: TcgPriserAdvancedOptions;
}

/**
 * Client for the tcgpriser.se API — Pokémon TCG price data, catalog, shop matches and bargains for
 * Sweden's tracked shops.
 *
 * ```ts
 * import { TcgPriser } from 'tcgpriser';
 *
 * const tcgpriser = new TcgPriser();
 * const card = await tcgpriser.cards.get('mega-evolution-ascended-heroes-fezandipiti-ex');
 * console.log(card.retailPrice, card.lowestShopOffer?.shop.name);
 * ```
 *
 * Most methods cover the API's public, unauthenticated surface (see https://api.tcgpriser.se/docs)
 * — the example above needs no token. A smaller set of premium methods (live pricing refresh,
 * per-condition price history, cross-shop comparison, bargain search, shop-URL submission) require a
 * subscriber's JWT — see https://api.tcgpriser.se/premium-docs and each resource's method docs for
 * which ones:
 *
 * ```ts
 * const tcgpriser = new TcgPriser(myJwt); // shorthand for { authToken: myJwt }
 * await tcgpriser.cards.livePricing('fezandipiti-ex');
 * ```
 */
export class TcgPriser {
  readonly cards: CardsResource;
  readonly products: ProductsResource;
  readonly expansions: ExpansionsResource;
  readonly shops: ShopsResource;
  readonly shopMatches: ShopMatchesResource;
  readonly shopMatchStats: ShopMatchStatsResource;
  readonly shopUrls: ShopUrlsResource;
  readonly priceStats: PriceStatsResource;
  readonly bargains: BargainsResource;
  readonly packRates: PackRatesResource;
  readonly stats: StatsResource;

  /**
   * @param optionsOrAuthToken Either a subscriber JWT directly (`new TcgPriser(myJwt)`) — the
   * common case, no different from passing `{ authToken: myJwt }` — or a full `TcgPriserOptions`
   * object. Omit entirely for an anonymous client that only calls public methods.
   */
  constructor(optionsOrAuthToken?: string | TcgPriserOptions) {
    const options: TcgPriserOptions =
      typeof optionsOrAuthToken === 'string' ? { authToken: optionsOrAuthToken } : (optionsOrAuthToken ?? {});
    const advanced = options.advanced ?? {};

    if (!advanced.fetch && typeof fetch === 'undefined') {
      throw new Error(
        'tcgpriser: no global fetch found. Pass { advanced: { fetch } } explicitly on Node < 18, or run on Node 18+.',
      );
    }

    const http = new HttpClient({
      baseUrl: advanced.baseUrl ?? DEFAULT_BASE_URL,
      fetch: advanced.fetch ?? fetch,
      headers: advanced.headers,
      authToken: options.authToken,
    });

    this.cards = new CardsResource(http);
    this.products = new ProductsResource(http);
    this.expansions = new ExpansionsResource(http);
    this.shops = new ShopsResource(http);
    this.shopMatches = new ShopMatchesResource(http);
    this.shopMatchStats = new ShopMatchStatsResource(http);
    this.shopUrls = new ShopUrlsResource(http);
    this.priceStats = new PriceStatsResource(http);
    this.bargains = new BargainsResource(http);
    this.packRates = new PackRatesResource(http);
    this.stats = new StatsResource(http);
  }
}
