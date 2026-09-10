import type { components } from '../generated/openapi.js';

/** A set/expansion, as returned by `client.expansions.list()`. This is the full record, including
 * the `sealedCount`/`cardCount`/`productCount` aggregation `list()` runs. The `expansion` field
 * embedded on a card or product, and the result of `client.expansions.get()`, are the smaller
 * `ExpansionRef` from `types/common.ts` instead; both shapes include the owning `brand`. */
export type Expansion = components['schemas']['Expansion'];

/** `client.expansions.releaseGroup()`: the other expansions in a release group (e.g. a core set's
 * variant drops), excluding the requested expansion itself. Empty `expansions` and undefined
 * `releaseGroupName` when the expansion isn't part of a release group. */
export type ExpansionReleaseGroup = components['schemas']['ExpansionReleaseGroup'];
