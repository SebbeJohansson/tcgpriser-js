import type { components } from '../generated/openapi.js';

/** A set/expansion, as returned by `client.expansions.list()`. This is the full record, including
 * the `sealedCount`/`cardCount`/`productCount` aggregation `list()` runs. The `expansion` field
 * embedded on a card or product, and the result of `client.expansions.get()`, are the smaller
 * `ExpansionRef` from `types/common.ts` instead. */
export type Expansion = components['schemas']['Expansion'];
