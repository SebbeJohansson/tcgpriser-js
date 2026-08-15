/**
 * Shared primitives reused across every resource. Pulled from `src/generated/openapi.d.ts` via
 * indexed access instead of retyped by hand, so a field rename in the API is a compile error here,
 * not silent drift.
 *
 * `CardWithPricing` is the extraction source for the nested ref shapes (`brand`, `category`,
 * `expansion`, the shop/bargain shape on `lowestShopOffer`). The API inlines these instead of
 * `$ref`-ing a shared component, so there's no single canonical name to pull from. They're
 * byte-identical across `ProductWithPricing`, `PackRate` and the shop-match schemas too, so picking
 * one as the source of truth works fine.
 */
import type { components } from '../generated/openapi.js';

type CardSchema = components['schemas']['CardWithPricing'];
type LowestShopOfferSchema = NonNullable<CardSchema['lowestShopOffer']>;

/** A Mongo ObjectId, always a 24-char lowercase hex string. Just `string`, not a branded type;
 * nothing here needs to tell it apart from any other id at compile time. */
export type ResourceId = string;

/** ISO-4217 currency code, e.g. `"SEK"` or `"EUR"`. */
export type CurrencyCode = string;

/** ISO 8601 timestamp, as returned by the API (always UTC, `Z`-suffixed). */
export type Timestamp = string;

export type PrintingLanguage = NonNullable<CardSchema['language']>;

export type PageMeta = components['schemas']['PageMeta'];

/** The standard paginated list envelope every `list`/`search` method returns. Hand-declared, not
 * generated: the API repeats a fresh anonymous `{ data, pagination }` object per endpoint rather
 * than naming it once. */
export interface ListResponse<T> {
  data: T[];
  pagination: PageMeta;
}

/** Query params shared by every offset-paginated list endpoint. */
export interface PaginationParams {
  limit?: number;
  skip?: number;
}

export type AlternativeName = CardSchema['alternativeNames'][number];
export type BrandRef = CardSchema['brand'];
export type CategoryRef = NonNullable<CardSchema['category']>;

/** The expansion shape embedded on cards, products and pack rates. Not the full `Expansion`
 * returned by `client.expansions.list()`, which additionally carries counts and a `brand`. */
export type ExpansionRef = NonNullable<CardSchema['expansion']>;

/** The minimal shop identity embedded on offers and matches. */
export type ShopRef = LowestShopOfferSchema['shop'];

export type BargainReferenceSource = NonNullable<LowestShopOfferSchema['bargain']>['referenceSource'];

/** Present on an offer/match when its price is a known-good discount off a reference price. */
export type BargainInfo = NonNullable<LowestShopOfferSchema['bargain']>;

/** The cheapest current shop offer for a card or product. */
export type LowestShopOffer = LowestShopOfferSchema;

export type ReferencePriceProvider =
  CardSchema['referencePriceSnapshotsByProvider'][string]['provider'];

export type ReferencePriceSnapshot = CardSchema['referencePriceSnapshotsByProvider'][string];

/** Keyed by provider, at most one snapshot per provider. */
export type ReferencePriceSnapshotsByProvider = Partial<
  Record<ReferencePriceProvider, ReferencePriceSnapshot>
>;
