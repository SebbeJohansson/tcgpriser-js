import type { components } from '../generated/openapi.js';

/** A set/expansion, as returned by `client.expansions.list()`. This is the full record. The
 * `expansion` field embedded on a card or product is the smaller `ExpansionRef` from
 * `types/common.ts`. */
export type Expansion = components['schemas']['Expansion'];

/** Response of `client.expansions.products()`: everything in one expansion, cards and sealed
 * products kept as separate `cards`/`sealed` groups rather than merged into one mixed list. */
export type ExpansionContents = components['schemas']['ExpansionContents'];

/** One card as embedded in `client.expansions.products()`'s `cards` group. The API inlines this
 * rather than `$ref`-ing `CardWithPricing`, so it's a separately-named (if structurally identical)
 * shape rather than literally `Card`. */
export type ExpansionCard = ExpansionContents['cards']['items'][number];

/** One sealed product as embedded in `client.expansions.products()`'s `sealed` group. Same caveat
 * as `ExpansionCard`: inlined by the API, not `$ref`-ing `ProductWithPricing`. */
export type ExpansionSealedProduct = ExpansionContents['sealed']['items'][number];
