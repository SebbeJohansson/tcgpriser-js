import type { components } from '../generated/openapi.js';

/** One rarity's share of a booster pack's pulls. `weight` is relative to the other buckets in the
 * same pack rate, not a percentage. Normalise across `buckets` yourself if you need one. */
export type PackRateBucket = components['schemas']['PackRate']['buckets'][number];

/** Pull-rate odds for one expansion's booster packs, as returned by `client.packRates.list()` /
 * `client.packRates.get()`. */
export type PackRate = components['schemas']['PackRate'];
