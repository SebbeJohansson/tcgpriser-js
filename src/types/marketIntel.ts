import type { components } from '../generated/openapi.js';

/** Enough of a catalog item to render one leaderboard row and link to it. */
export type RankedItem = components['schemas']['RankedItem'];

/** One item's price movement over a window, as returned by `cards.marketMovers()` /
 * `products.marketMovers()`. `currentPrice` and `previousPrice` are daily averages of realised
 * sales, not shop asking prices. */
export type MarketMover = components['schemas']['MarketMover'];

/** A movers leaderboard plus the two windows it was computed over. */
export type MarketMovers = components['schemas']['MarketMovers'];

/** Which cut of the movers list to rank. */
export type MoverKind =
  | 'topGainersPercent'
  | 'topDroppersPercent'
  | 'topGainersAmount'
  | 'topDroppersAmount'
  | 'mostActive'
  | 'newHighs'
  | 'newLows'
  | 'volatilityLeaders';

/** One slot of a booster pack and what a draw into it is worth. Check `pricedCount` against
 * `poolSize`: unpriced cards count as 0 kr, so thin coverage understates the slot. */
export type PackSlotValue = components['schemas']['PackSlotValue'];

/** What one booster pack of an expansion is worth opened, and what that rests on. */
export type PackExpectedValue = components['schemas']['PackExpectedValue'];

/** One sealed unit valued against the pack figure. `valueRatio` below 1 means the sealed article
 * carries a premium over its contents, which is the market's normal state rather than a signal. */
export type SealedUnitValue = components['schemas']['SealedUnitValue'];

/** One thing the expected-value figure takes for granted. Switch on `code` to say it in your own
 * language; `message` is the English fallback. */
export type ExpectedValueAssumption = components['schemas']['ExpectedValueAssumption'];

/** The full expected-value answer for one expansion, as returned by
 * `expansions.expectedValue()`. Render `assumptions` alongside the figure — it states what the
 * number takes for granted, and the number is only honest with it. */
export type ExpansionExpectedValue = components['schemas']['ExpansionExpectedValue'];

/** The raw (ungraded) price a grading premium is measured against. `basis` says whether that came
 * from observed Near Mint sales or from the stored estimate; the two are not equally strong. */
export type GradingRawPrice = components['schemas']['GradingRawPrice'];

/** The costs a caller states so profit and ROI can be computed. */
export type GradingCosts = components['schemas']['GradingCosts'];

/** What one company/grade combination sells for, and what that would net. Everything from
 * `netProceeds` down is undefined unless the request supplied costs — the API ships no fee table
 * on purpose. */
export type GradedOutcome = components['schemas']['GradedOutcome'];

/** The full grading answer for one card, as returned by `cards.gradingRoi()`. */
export type GradingRoi = components['schemas']['GradingRoi'];
