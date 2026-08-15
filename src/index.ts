export { TcgPriser, DEFAULT_BASE_URL, type TcgPriserOptions } from './client.js';
export { TcgPriserError, type TcgPriserErrorCode } from './errors.js';
export type { PremiumOptions } from './http.js';

export type {
  ListCardsParams,
  CardMatchesParams,
  CardReferencePricesParams,
  CardPricesParams,
} from './resources/cards.js';
export type {
  ListProductsParams,
  ProductMatchesParams,
  ProductReferencePricesParams,
  ProductPricesParams,
} from './resources/products.js';
export type {
  ListShopMatchesParams,
  ShopMatchesForShopParams,
} from './resources/shopMatches.js';
export type {
  ShopMatchStatsForProductParams,
  ShopMatchStatsForShopParams,
  CompareShopPricesParams,
} from './resources/shopMatchStats.js';
export type { SubmitShopUrlParams, AssignShopUrlProductParams } from './resources/shopUrls.js';
export type {
  ProductFilterParams,
  DailyPriceStatsParams,
  EstimatedValuesParams,
  TopProductsParams,
  ProductDailyStatsParams,
  ProductByVariantParams,
  ProductDailyByVariantParams,
} from './resources/priceStats.js';
export type { ListBargainsParams, SearchBargainsParams } from './resources/bargains.js';
export type { ListShopsParams } from './resources/shops.js';

export * from './types/index.js';

// Raw generated schema, for anyone who wants the wire types directly instead of going through
// the hand-picked exports in types/index.ts.
export type { components } from './generated/openapi.js';
