import type { components } from '../generated/openapi.js';

/** One rarity's share of a booster pack's pulls. `weight` is relative to the other buckets in the
 * same pack rate, not a percentage. Normalise across `buckets` yourself if you need one. */
export type PackRateBucket = components['schemas']['PackRateBucket'];

/** Pull-rate odds for one expansion's booster packs, as returned by `client.packRates.list()` /
 * `client.packRates.get()`. */
export type PackRate = components['schemas']['PackRate'];

/** One of the 9 fixed slots in a simulated pack (4 common, 3 uncommon, 1 reverse, 1 hit). */
export type PackSlot = NonNullable<PackRate['slotOrder']>[number];
