import type { components } from '../generated/openapi.js';
import type { Card, SealedProduct } from './catalog.js';

/** A set/expansion, as returned by `client.expansions.list()`. This is the full record. The
 * `expansion` field embedded on a card or product is the smaller `ExpansionRef` from
 * `types/common.ts`. */
export type Expansion = components['schemas']['Expansion'];

/** Response of `client.expansions.products()`: everything in one expansion, cards and sealed
 * products kept as separate `cards`/`sealed` groups rather than merged into one mixed list. */
export type ExpansionContents = components['schemas']['ExpansionContents'];

/** One card as embedded in `client.expansions.products()`'s `cards` group. `$ref`s `CardWithPricing`
 * on the wire, so this is literally `Card` — kept as its own name since a card found through an
 * expansion's contents reads more naturally as `ExpansionCard` at the call site. */
export type ExpansionCard = Card;

/** One sealed product as embedded in `client.expansions.products()`'s `sealed` group. Literally
 * `SealedProduct`, same reasoning as `ExpansionCard`. */
export type ExpansionSealedProduct = SealedProduct;
