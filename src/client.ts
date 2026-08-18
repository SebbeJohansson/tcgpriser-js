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

/** Local dev, self-hosting and testing overrides. Most integrations never touch these. */
export interface TcgPriserAdvancedOptions {
  /** Point at a local dev server or a self-hosted instance. Defaults to production. */
  baseUrl?: string;
  /** Extra headers sent on every request, e.g. a custom `User-Agent`. */
  headers?: Record<string, string>;
  /** Swap in a different `fetch` (older Node, testing, a proxying agent). Defaults to global `fetch`. */
  fetch?: typeof fetch;
}

export interface TcgPriserOptions {
  /**
   * A signed-in subscriber's JWT. Only needed for premium methods (`cards.prices()`,
   * `priceStats.product()`, `bargains.search()` etc.); public methods work fine without it.
   * This client has no login flow of its own, so bring your own token.
   *
   * Every premium method also accepts its own `authToken` to override this per call. Useful when
   * one server-side client is shared across requests for several different signed-in users.
   */
  authToken?: string;
  /** Local dev / self-hosting / testing overrides. Leave unset unless you know you need it. */
  advanced?: TcgPriserAdvancedOptions;
}

/**
 * Client for the tcgpriser.se API: Pokémon TCG price data, catalog, shop matches and bargains for
 * shops tracked in Sweden.
 *
 * ```ts
 * import { TcgPriser } from 'tcgpriser';
 *
 * const tcgpriser = new TcgPriser();
 * const card = await tcgpriser.cards.get('mega-evolution-ascended-heroes-fezandipiti-ex');
 * console.log(card.retailPrice, card.lowestShopOffer?.shop.name);
 * ```
 *
 * That example needs no token. Most of the API is public (https://api.tcgpriser.se/docs). A
 * smaller set of premium methods (live pricing, per-condition history, shop comparison, bargain
 * search, shop-URL submission) need a subscriber's JWT (https://api.tcgpriser.se/premium-docs):
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
   * @param optionsOrAuthToken A subscriber JWT (`new TcgPriser(myJwt)`), a full
   * `TcgPriserOptions` object, or omit it entirely for an anonymous, public-only client.
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
      // Bound to globalThis: both browsers and Node's undici implement fetch as a method that
      // checks its receiver, so an unbound reference throws "Illegal invocation" the moment it's
      // called through anything other than `window.fetch(...)`/`globalThis.fetch(...)` — which is
      // exactly what happens once HttpClient stores it and calls `this.fetchImpl(...)`.
      fetch: advanced.fetch ?? fetch.bind(globalThis),
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
