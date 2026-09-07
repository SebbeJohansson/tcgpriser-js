import type { components } from '../generated/openapi.js';

/** A brand/franchise (e.g. "Pokémon"), as returned by `client.brands.list()` /
 * `client.brands.get()`. Same shape as `BrandRef` (the form embedded on `Card`/`SealedProduct`/
 * `Expansion`) today — kept as its own named type for symmetry with `Shop`/`ShopRef` and
 * `Expansion`/`ExpansionRef`, in case the two diverge later. This is the value `brand` filters on
 * `cards.list()`, `products.list()` and `expansions.list()` accept (either `id` or
 * `technicalName`). */
export type Brand = components['schemas']['Brand'];
