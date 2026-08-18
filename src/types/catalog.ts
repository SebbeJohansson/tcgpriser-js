import type { components } from '../generated/openapi.js';

/** A card, as returned by `client.cards.get()` / `client.cards.list()`, and as embedded in
 * `client.expansions.products()`. `kind: 'card'` is a literal on the generated type, which is what
 * makes `CatalogItem` (below) discriminate cleanly. */
export type Card = components['schemas']['CardWithPricing'];

/** A sealed product (booster box, ETB, tin, ...), as returned by `client.products.get()` /
 * `client.products.list()`. `kind: 'sealed'` is a literal on the generated type. */
export type SealedProduct = components['schemas']['ProductWithPricing'];

/** A card or sealed product, discriminated on `kind`. */
export type CatalogItem = Card | SealedProduct;

export type CardVariants = NonNullable<Card['variants']>;

/** The compact item reference used inside flat shop-match rows (`client.shopMatches.list()` /
 * `.forShop()`), enough to render a result list, not the full `CatalogItem`. */
export type MatchedItemRef = components['schemas']['MatchedItemRef'];

/** One shop listing currently discounted relative to a reference price (retail, Tradera, or
 * Cardmarket). Returned by `client.bargains.list()` / `client.bargains.search()`. */
export type Bargain = components['schemas']['BargainListing'];

export type BargainProductRef = Bargain['product'];
