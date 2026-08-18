import type { components } from '../generated/openapi.js';

type ShopMatchWithItemSchema = components['schemas']['ShopMatchWithItem'];
type ItemShopMatchSchema = components['schemas']['ItemShopMatches']['data'][number];

/** A shop tracked by tcgpriser, as returned by `client.shops.list()` / `client.shops.get()`. The
 * `*Count` fields are `undefined` when the shop has never had a match computed (rather than `0`, which
 * would mean "matched, currently empty"). */
export type Shop = components['schemas']['Shop'];

/** The lighter shop shape embedded in shop-match responses: a subset of `Shop`, no id or delivery
 * cost breakdown. */
export type ShopSummary = components['schemas']['ShopMatchStats']['shop'];

export type CardType = NonNullable<ShopMatchWithItemSchema['cardType']>;
export type ItemCondition = NonNullable<ShopMatchWithItemSchema['itemCondition']>;
export type GradingCompany = NonNullable<ShopMatchWithItemSchema['gradingCompany']>;

/** A shop's listing matched (or not yet matched) to a catalog item. Returned by
 * `client.shopMatches.list()` and as the rows inside `client.shopMatches.forShop()`. */
export type ShopMatch = ShopMatchWithItemSchema;

export type ShopMatchDelivery = ItemShopMatchSchema['shop']['delivery'];

/** A shop-match row scoped to one already-known item. `client.cards.matches()` and
 * `client.products.matches()` drop `item`/`expansion`/`category` since the caller already has
 * them, but add delivery terms since you're looking at one listing's total cost here. */
export type ItemShopMatch = ItemShopMatchSchema;

/** Response of `client.cards.matches()` / `client.products.matches()`. */
export type ItemShopMatches = components['schemas']['ItemShopMatches'];

/** Response of `client.shopMatches.forShop()`: every match, of any item, currently live at one shop. */
export type ShopMatchesForShop = components['schemas']['ShopMatchesForShop'];

/** One row of `client.shopMatches.shopStats()`: match counts per shop, not the matches themselves. */
export type ShopMatchStats = components['schemas']['ShopMatchStats'];
