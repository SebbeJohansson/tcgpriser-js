import type { components } from '../generated/openapi.js';

/** A set/expansion, as returned by `client.expansions.list()`. This is the full record. The
 * `expansion` field embedded on a card or product is the smaller `ExpansionRef` from
 * `types/common.ts`. */
export type Expansion = components['schemas']['Expansion'];

/** Response of `client.expansions.products()`: everything in one expansion, cards and sealed
 * products kept as separate `cards`/`sealed` groups rather than merged into one mixed list. */
export type ExpansionContents = components['schemas']['ExpansionContents'];
