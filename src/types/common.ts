/**
 * Shared primitives reused across every resource — derived from `src/generated/openapi.d.ts` via
 * indexed access rather than retyped by hand, so a field rename/removal in the API surfaces as a
 * compile error here instead of silently drifting. See README.md "Design notes".
 *
 * `CardWithPricing` is the extraction source for the nested ref shapes (`brand`, `category`,
 * `expansion`, the shop/bargain shape on `lowestShopOffer`) because every one of them is byte-identical
 * to its counterpart on `ProductWithPricing`, `PackRate`, and the shop-match schemas — the API inlines
 * these nested objects rather than `$ref`-ing a shared component, so `openapi-typescript` gives us no
 * single canonical name for them. Picking one schema as the source of truth for each shape is the
 * least-repetitive way to name them.
 */
import type { components } from '../generated/openapi.js';

type CardSchema = components['schemas']['CardWithPricing'];
type LowestShopOfferSchema = NonNullable<CardSchema['lowestShopOffer']>;

/** A Mongo ObjectId, always a 24-char lowercase hex string. Kept as `string` rather than a branded
 * type — nothing in this SDK needs to distinguish it from any other id at compile time. */
export type ResourceId = string;

/** ISO-4217 currency code, e.g. `"SEK"` or `"EUR"`. */
export type CurrencyCode = string;

/** ISO 8601 timestamp, as returned by the API (always UTC, `Z`-suffixed). */
export type Timestamp = string;

export type PrintingLanguage = NonNullable<CardSchema['language']>;

export type PageMeta = components['schemas']['PageMeta'];

/** The standard paginated list envelope every `list`/`search` method returns. Not itself a
 * generated type — the API's envelope is a fresh anonymous `{ data, pagination }` object per
 * endpoint rather than a named, reusable schema, so this is the one place a shared shape is worth
 * declaring by hand. */
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

/** The expansion shape embedded on cards, products and pack rates — not the full `Expansion`
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

/** Keyed by provider — at most one snapshot per provider. */
export type ReferencePriceSnapshotsByProvider = Partial<
  Record<ReferencePriceProvider, ReferencePriceSnapshot>
>;
