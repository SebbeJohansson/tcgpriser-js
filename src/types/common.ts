/**
 * Shared primitives reused across every resource. Pulled from `src/generated/openapi.d.ts` via
 * indexed access instead of retyped by hand, so a field rename in the API is a compile error here,
 * not silent drift.
 *
 * The API registers `Brand`, `CategoryRef`, `ExpansionRef`, `ShopRef` etc. as their own named
 * components and `$ref`s them wherever they're embedded (in `CardWithPricing`, `ProductWithPricing`,
 * `PackRate`, the shop-match schemas, ...), so those are pulled by name directly. `CardWithPricing`
 * is still the extraction source for the handful of shapes that aren't independently registered
 * (`lowestShopOffer`'s `bargain`, the reference-price snapshot map).
 */
import type { components } from '../generated/openapi.js';

type CardSchema = components['schemas']['CardWithPricing'];
type LowestShopOfferSchema = components['schemas']['LowestShopOffer'];

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

export type AlternativeName = components['schemas']['AlternativeName'];
export type BrandRef = components['schemas']['Brand'];
export type CategoryRef = components['schemas']['CategoryRef'];

/** The expansion shape embedded on cards, products and pack rates. Not the full `Expansion`
 * returned by `client.expansions.list()`, which additionally carries counts and a `brand`. */
export type ExpansionRef = components['schemas']['ExpansionRef'];

/** The minimal shop identity embedded on offers and matches. */
export type ShopRef = components['schemas']['ShopRef'];

export type BargainReferenceSource = NonNullable<LowestShopOfferSchema['bargain']>['referenceSource'];

/** Present on an offer/match when its price is a known-good discount off a reference price. */
export type BargainInfo = NonNullable<LowestShopOfferSchema['bargain']>;

/** The cheapest current shop offer for a card or product. */
export type LowestShopOffer = LowestShopOfferSchema;

export type ReferencePriceSnapshot = components['schemas']['ReferencePriceSummary'];

export type ReferencePriceProvider = ReferencePriceSnapshot['provider'];

/** Keyed by provider, at most one snapshot per provider. */
export type ReferencePriceSnapshotsByProvider = Partial<
  Record<ReferencePriceProvider, ReferencePriceSnapshot>
>;
