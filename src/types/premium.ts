/**
 * Types for the premium tier — endpoints that require a signed-in subscriber's JWT (see
 * `TcgPriserOptions.authToken` / the `authToken` field on each premium method's params). Kept apart
 * from `types/index.ts`'s public-tier types because every one of these is meaningless without a
 * token: the API answers `403 premiumRequired` rather than a partial/free version of the shape.
 *
 * Derived from `src/generated/openapi.d.ts` like every other file in this directory.
 */
import type { components } from '../generated/openapi.js';
import type { GradingCompany, ItemCondition } from './shop.js';

// ---- Reference prices (Cardmarket / TCGplayer / eBay / Tradera history) ----

export type ReferencePriceSeries = components['schemas']['ItemReferencePrices']['series'][number];
export type ReferencePriceSeriesPoint = ReferencePriceSeries['points'][number];
export type ReferencePriceSource = ReferencePriceSeries['source'];
export type ReferencePriceCardVariant = NonNullable<ReferencePriceSeries['variant']>;
export type ReferencePriceMetric = components['schemas']['ItemReferencePrices']['metric'];
export type ReferencePriceCurrencyMode = components['schemas']['ItemReferencePrices']['currencyMode'];

/** Response of `client.cards.referencePrices()` / `client.products.referencePrices()`.
 *
 * Non-graded card prices come from TCGdex and are variant-aware (normal / holo / reverse); graded
 * prices and eBay medians come from cmapi; Tradera is tcgpriser's own data — realised Swedish
 * auction sales rather than asking prices, always SEK, and variant-less. In native mode each series
 * keeps its own `currency`; in `sek` mode every series is `SEK`, converted at the rate stored on
 * each point. */
export type ItemReferencePrices = components['schemas']['ItemReferencePrices'];

// ---- Sold prices (marketplace auction sales) ----

export type SoldPrice = components['schemas']['ItemSoldPrices']['data'][number];

/** Response of `client.cards.prices()` / `client.products.prices()`. `premiumRequired` is always
 * `true` here — the field exists on the wire type because the same envelope shape is reused for a
 * free preview elsewhere in the API, not because this response can ever be a preview. */
export type ItemSoldPrices = components['schemas']['ItemSoldPrices'];

// ---- Live pricing (freshly computed, not read from the last stats job) ----

export type LivePricingDetail = components['schemas']['LivePricingForItem']['pricing'];

/** Response of `client.cards.livePricing()` / `client.products.livePricing()`. */
export type LivePricingForItem = components['schemas']['LivePricingForItem'];

/** Response of `client.expansions.livePricing()` — live pricing for every item in one expansion. */
export type ExpansionLivePricing = components['schemas']['ExpansionLivePricing'];

// ---- Per-product stats bundle ----

/** The catalog item as embedded in stats responses — a `Card`/`SealedProduct` without the two
 * fields (`lowestShopOffer`, `referencePriceSnapshotsByProvider`) that these endpoints already
 * answer more precisely themselves. */
export type StatsItemRef = components['schemas']['ItemStats']['item'];

export type VariantStatsSummary = components['schemas']['ItemStats']['variantStats'];

/** Response of `client.priceStats.product()`. */
export type ItemStats = components['schemas']['ItemStats'];

/** Response of `client.priceStats.productFull()` — everything `product()` has, plus the item's
 * current shop matches. */
export type ItemFullStats = components['schemas']['ItemFullStats'];

// ---- Per-variant (condition / grade) stats ----

export type VariantPriceStat = components['schemas']['ItemVariantStats']['variants']['loose'][string];

/** Response of `client.priceStats.productByVariant()`. The generated shape keys `loose`/`graded`
 * by a bare `string` (JSON Schema `additionalProperties` carries no enum); re-keyed here by the
 * actual `ItemCondition`/`GradingCompany` enums for better autocomplete — the one place in this
 * file a hand-written wrapper earns its keep over a plain alias. `graded` nests grade as a second
 * string-keyed level, since a grade (`10`, `9.5`) came from a JSON object key. */
export interface ItemVariantStats {
  item: components['schemas']['ItemVariantStats']['item'];
  variants: {
    loose: Partial<Record<ItemCondition, VariantPriceStat>>;
    graded: Partial<Record<GradingCompany, Record<string, VariantPriceStat>>>;
  };
}

export type VariantSelector = components['schemas']['ItemVariantDailyStats']['variant'];

/** Response of `client.priceStats.productDailyByVariant()`. */
export type ItemVariantDailyStats = components['schemas']['ItemVariantDailyStats'];

// ---- Shop <-> product price history ----

export type ShopPricePoint = components['schemas']['ItemShopPriceHistory']['shops'][number]['history'][number];

/** Response of `client.shopMatchStats.forProduct()` — one product's price history, broken out per
 * shop. */
export type ItemShopPriceHistory = components['schemas']['ItemShopPriceHistory'];

/** Response of `client.shopMatchStats.forShop()` — one shop's price history, broken out per
 * product. */
export type ShopPriceHistoryList = components['schemas']['ShopPriceHistoryList'];

// ---- Cross-shop price comparison ----

export type ShopPriceComparisonRow = components['schemas']['ItemPriceComparison']['items'][number];
export type ShopPriceComparisonStats = NonNullable<components['schemas']['ItemPriceComparison']['stats']>;

/** Response of `client.shopMatchStats.compare()` — one product's price at every shop that carries
 * it, as of one date. `stats` is `null` when no shop had a price on that date. */
export type ItemPriceComparison = components['schemas']['ItemPriceComparison'];

// ---- Shop URL submission / assignment ----

export type ShopUrlStatus = components['schemas']['ShopUrlMutationResult']['shopUrl']['status'];
export type ShopUrlDiscoveredBy = components['schemas']['ShopUrlMutationResult']['shopUrl']['discoveredBy'];

/** A URL at a shop that tcgpriser scrapes, and what it has been matched to. */
export type ShopUrl = components['schemas']['ShopUrlMutationResult']['shopUrl'];

/** Response of `client.shopUrls.submit()` / `client.shopUrls.assignProduct()`. */
export type ShopUrlMutationResult = components['schemas']['ShopUrlMutationResult'];
