import type { components } from '../generated/openapi.js';

/** A card, as returned by `client.cards.get()` / `client.cards.list()`, and as embedded in
 * `client.expansions.products()`. `kind: 'card'` is a literal on the generated type, which is what
 * makes `CatalogItem` (below) discriminate cleanly. Content only — no pricing fields; fetch those
 * separately via `client.cards.pricing()` / `.pricingBatch()`. */
export type Card = components['schemas']['Card'];

/** A sealed product (booster box, ETB, tin, ...), as returned by `client.products.get()` /
 * `client.products.list()`. `kind: 'sealed'` is a literal on the generated type. Content only — no
 * pricing fields; fetch those separately via `client.products.pricing()` / `.pricingBatch()`. */
export type SealedProduct = components['schemas']['Product'];

/** A card or sealed product, discriminated on `kind`. */
export type CatalogItem = Card | SealedProduct;

/** Pricing for one catalog item (card or sealed product) — `retailPrice`, `estimatedValue`,
 * `lowestShopOffer`, `referencePriceSnapshotsByProvider` — refreshed once a day by the nightly
 * pricing/scraper jobs, not embedded in `Card`/`SealedProduct` above. Returned by
 * `client.cards.pricing()` / `.pricingBatch()` and their `client.products` equivalents. */
export type CatalogItemPricing = components['schemas']['CatalogItemPricing'];

export type CardVariants = components['schemas']['CardVariants'];

/** The compact item reference used inside flat shop-match rows (`client.shopMatches.list()` /
 * `.forShop()`), enough to render a result list, not the full `CatalogItem`. */
export type MatchedItemRef = components['schemas']['MatchedItemRef'];

/** One shop listing currently discounted relative to a reference price (retail, Tradera, or
 * Cardmarket). Returned by `client.bargains.list()` / `client.bargains.search()`. */
export type Bargain = components['schemas']['BargainListing'];

export type BargainProductRef = Bargain['product'];
