import type { components } from '../generated/openapi.js';

/** A named `{ id, name }` reference to a card or product: the compact identity used by every
 * `price-stats` response, which is keyed by item rather than embedding the full catalog record. */
export type ItemRef = components['schemas']['ItemDailyStats']['item'];

/** One day's average price for one item. */
export type DailyPricePoint = components['schemas']['ItemDailyStats']['dailyStats'][number];

/** Response row of `client.priceStats.daily()`. */
export type ItemDailyStats = components['schemas']['ItemDailyStats'];

export type EstimatedValue = components['schemas']['ItemEstimatedValue']['estimate'];

/** Response row of `client.priceStats.estimatedValues()`. */
export type ItemEstimatedValue = components['schemas']['ItemEstimatedValue'];

/** Response row of `client.priceStats.topProducts()`: items ranked by shop availability, not price. */
export type TopItem = components['schemas']['TopItem'];
