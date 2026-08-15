# tcgpriser

A typed Node.js / browser client for the [tcgpriser.se](https://tcgpriser.se) API — Pokémon TCG
price data, catalog, shop matches and bargains for shops tracked in Sweden.

```ts
import { TcgPriser } from 'tcgpriser';

const tcgpriser = new TcgPriser();

const card = await tcgpriser.cards.get('mega-evolution-ascended-heroes-fezandipiti-ex');
console.log(card.retailPrice, card.lowestShopOffer?.shop.name);

const { data: bargains } = await tcgpriser.bargains.list({ type: 'card' });
```

Most methods cover the API's public, unauthenticated surface (https://api.tcgpriser.se/docs) — no
token needed. A smaller set of **premium** methods (live pricing refresh, per-condition price
history, cross-shop comparison, bargain search, shop-URL submission) need a signed-in subscriber's
JWT — see [Premium endpoints](#premium-endpoints) below.

## Install

```
npm install tcgpriser
```

Requires Node 18+ (for global `fetch`), or pass a `fetch` implementation yourself (see below). Ships
both ESM and CommonJS builds plus `.d.ts` types.

## Usage

```ts
import { TcgPriser } from 'tcgpriser';

const tcgpriser = new TcgPriser();
// or, pointed at a local dev instance:
// const tcgpriser = new TcgPriser({ advanced: { baseUrl: 'http://localhost:5000' } });

// Cards
await tcgpriser.cards.list({ search: 'pikachu', limit: 10 });
await tcgpriser.cards.get('mega-evolution-ascended-heroes-fezandipiti-ex'); // id or technicalName
await tcgpriser.cards.matches('fezandipiti-ex', { inStock: true });

// Sealed products (booster boxes, ETBs, tins, ...)
await tcgpriser.products.list({ search: 'booster box' });
await tcgpriser.products.get('scarlet-violet-booster-pack');
await tcgpriser.products.matches('scarlet-violet-booster-pack');

// Expansions
await tcgpriser.expansions.list();
await tcgpriser.expansions.products('eng-scarlet-violet-journey-together'); // { expansion, cards, sealed }

// Shops
await tcgpriser.shops.list({ active: true });
await tcgpriser.shops.get('alphaspel');

// Raw shop-match data
await tcgpriser.shopMatches.list({ shop: 'alphaspel', inStock: true });
await tcgpriser.shopMatches.forShop('alphaspel');
await tcgpriser.shopMatches.shopStats();

// Price stats
await tcgpriser.priceStats.daily({ technicalName: 'scarlet-violet-booster-pack' });
await tcgpriser.priceStats.estimatedValues({ expansion: 'eng-scarlet-violet-journey-together' });
await tcgpriser.priceStats.topProducts({ limit: 20 });

// Bargains
await tcgpriser.bargains.list({ type: 'sealed' }); // 'sealed' | 'card' | 'all'

// Pack rates (pull-rate odds per expansion)
await tcgpriser.packRates.list();
await tcgpriser.packRates.get(expansionId);

// Platform stats
await tcgpriser.stats.platform();
```

Every list/search method that supports real pagination (`cards`, `products`, `shopMatches`,
`priceStats`, `bargains`) returns `{ data, pagination }`. `expansions.list()`, `shops.list()` and
`packRates.list()` return a plain array instead — those sets are small and always returned in full,
so there's nothing to paginate.

## Premium endpoints

These need a signed-in subscriber's JWT — this client doesn't provide a way to obtain one (the
website's login is OAuth-based, not something a headless SDK can drive), so pass a token your own
app already has, either as the client's default or per call:

```ts
// as the client's default — good for a single-user app (e.g. a CLI, a script)
const tcgpriser = new TcgPriser(myJwt); // shorthand for new TcgPriser({ authToken: myJwt })
await tcgpriser.cards.livePricing('fezandipiti-ex');
```

```ts
// or per call, on a client with no default token — better when one server-side client instance is
// shared across many signed-in users' requests, since the client itself doesn't belong to any one
// of them
const tcgpriser = new TcgPriser();
await tcgpriser.cards.livePricing('fezandipiti-ex', { authToken: requestUserJwt });
```

A missing/invalid token gets `401 unauthorized`; a valid token without an active subscription gets
`403 premiumRequired` — both surface as `TcgPriserError` like any other error.

```ts
// Cards / products — fresh pricing, sale history, reference-price history
await tcgpriser.cards.livePricing('fezandipiti-ex', { authToken });
await tcgpriser.cards.prices('fezandipiti-ex', { authToken, limit: 20 });
await tcgpriser.cards.referencePrices('fezandipiti-ex', { authToken, days: 90 });
await tcgpriser.products.livePricing('scarlet-violet-booster-pack', { authToken });
await tcgpriser.products.prices('scarlet-violet-booster-pack', { authToken });
await tcgpriser.products.referencePrices('scarlet-violet-booster-pack', { authToken });

// Expansions — fresh pricing for every item at once
await tcgpriser.expansions.livePricing('eng-scarlet-violet-journey-together', { authToken });

// Price stats — deeper per-product stats than the public tier's daily/estimated-value
await tcgpriser.priceStats.product('scarlet-violet-booster-pack', { authToken });
await tcgpriser.priceStats.productFull('scarlet-violet-booster-pack', { authToken });
await tcgpriser.priceStats.productDaily('scarlet-violet-booster-pack', { authToken, days: 90 });
await tcgpriser.priceStats.productDailyLast30('scarlet-violet-booster-pack', { authToken });
await tcgpriser.priceStats.productEstimatedValue('scarlet-violet-booster-pack', { authToken });
await tcgpriser.priceStats.productByVariant('fezandipiti-ex', { authToken });
await tcgpriser.priceStats.productDailyByVariant('fezandipiti-ex', {
  authToken,
  cardType: 'graded',
  gradingCompany: 'PSA',
  grade: 10,
});

// Cross-shop price history and comparison
await tcgpriser.shopMatchStats.forProduct('scarlet-violet-booster-pack', { authToken });
await tcgpriser.shopMatchStats.forShop('alphaspel', { authToken });
await tcgpriser.shopMatchStats.compare({ authToken, productId: 'scarlet-violet-booster-pack' });

// Bargain search — like bargains.list(), but with real pagination and filters
await tcgpriser.bargains.search({ authToken, minDiscount: 20, cardType: 'graded' });

// Contribute to the catalog
await tcgpriser.shopUrls.submit({ authToken, url: 'https://example.se/product/x', shop: 'alphaspel' });
await tcgpriser.shopUrls.assignProduct('<shopUrlId>', { authToken, productId: '<productId>' });
```

### Errors

A non-2xx response throws `TcgPriserError`, carrying the API's structured error code:

```ts
import { TcgPriser, TcgPriserError } from 'tcgpriser';

try {
  await tcgpriser.cards.get('does-not-exist');
} catch (error) {
  if (error instanceof TcgPriserError) {
    console.log(error.statusCode, error.code, error.message);
    // 404 'notFound' 'Card not found'
  }
}
```

### Options

```ts
new TcgPriser(myJwt); // shorthand for { authToken: myJwt }
new TcgPriser(); // no default token — anonymous, public methods only

new TcgPriser({
  authToken: myJwt, // default bearer token for premium calls (see "Premium endpoints" above)

  // Local dev / self-hosting / testing only — leave this out for normal use against tcgpriser.se.
  advanced: {
    baseUrl: 'https://api.tcgpriser.se', // default; override to point at a local dev server etc.
    headers: { 'User-Agent': 'my-app/1.0' }, // sent on every request
    fetch: myCustomFetch, // defaults to global fetch (Node 18+)
  },
});
```

## Scope

This covers the API's full documented surface — public catalog/price/bargain reads plus the
premium endpoints above. Not covered: the admin/scraper/auth/subscription-management surface, which
isn't part of any published contract and isn't meant for third-party use regardless.

## Design notes

The wire types are generated-first: `src/generated/openapi.d.ts` is `openapi-typescript`'s raw
output against the API's premium OpenAPI spec (the broadest — every schema the public tier needs is
a subset of it), committed to the repo like `pris-tabell-ui` commits its own `types/openapi.d.ts`
from the same generator. Regenerate it with `yarn generate:types` when the API changes and review the
diff — that's the whole update workflow, no manual re-typing.

Everything in `src/types/*.ts` derives from that file via indexed access — `type Card =
components['schemas']['CardWithPricing']` — rather than retyping fields by hand, so a field
rename/removal in the API is a compile error here, not silent drift. A thin hand-written layer sits
on top only where it earns its keep:

- **Naming the unnamed.** The API inlines nested objects (a card's `brand`, `category`, `expansion`,
  the shop/bargain shape on `lowestShopOffer`) rather than `$ref`-ing a shared component, so
  `openapi-typescript` gives no reusable name for them. `types/common.ts` picks one schema as the
  source of truth per shape (e.g. `CardWithPricing` for `BrandRef`/`CategoryRef`/`ExpansionRef`) and
  exports a name for it.
- **A shared envelope.** `ListResponse<T>` replaces what the API emits as a fresh anonymous
  `{ data, pagination }` shape per endpoint.
- **Better keys than `string`.** `ItemVariantStats` (`priceStats.productByVariant()`) is the one
  response keyed by a JSON Schema `additionalProperties` — the generated type is `{ [key: string]: T
  }`; the hand-written version in `types/premium.ts` re-keys it by the actual `ItemCondition`/
  `GradingCompany` enums for real autocomplete.

Everything else — `Card | SealedProduct` discriminating on `kind`, `PlatformStats`, `PackRate`,
`ShopUrl`, and so on — is a direct `type X = components['schemas']['X']` alias (or an indexed-access
derivation off one), no hand-maintained field list to keep in sync. `ShopUrl`/`ShopUrlMutationResult`
used to be the one exception — `POST /shop-urls/submit` and `PATCH /shop-urls/{id}/product` didn't
declare a response schema in the API's own OpenAPI annotations, so nothing existed under
`components.schemas` to derive from. Fixed upstream in `pris-tabell-api` (added the missing
`content`/`schema` to those two routes' JSDoc, and corrected the submit route's documented status
code from 200 to the 201 it actually sends) rather than left as a permanent hand-typed gap here.

## Development

```
yarn install
yarn generate:types  # regenerate src/generated/openapi.d.ts from a live API (see "Design notes")
yarn build           # tsup -> dist/ (ESM + CJS + .d.ts)
yarn typecheck
yarn test            # mocked-fetch tests, always run
yarn example         # runs examples/basic.ts against a local dev API
```

`test/live.test.ts` is a smoke test against a real API instance rather than a mock — it skips itself
if nothing answers at `TCGPRISER_TEST_BASE_URL` (default `http://localhost:5000`), so `yarn test`
stays green with the API not running. Start `pris-tabell-api`'s dev server first
(`yarn dev` there) to exercise it for real:

```
yarn test                                              # local dev API, or skipped if not running
TCGPRISER_TEST_BASE_URL=https://api.tcgpriser.se yarn test   # against production
```

`examples/basic.ts` also exercises a premium call (`cards.livePricing`); pass a real subscriber JWT
to see it succeed instead of the expected 401:

```
TCGPRISER_AUTH_TOKEN=<your JWT> yarn example
```

## Publishing

```
yarn build
npm publish
```

`files` in package.json restricts the published tarball to `dist/`.
