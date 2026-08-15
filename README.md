# tcgpriser

<p>
  <a href="https://www.npmjs.com/package/tcgpriser"><img src="https://img.shields.io/npm/v/tcgpriser" alt="Version"></a>
  <a href="https://www.npmjs.com/package/tcgpriser"><img src="https://img.shields.io/npm/dm/tcgpriser" alt="Downloads"></a>
  <a href="https://github.com/SebbeJohansson/tcgpriser-js/blob/main/LICENSE"><img src="https://img.shields.io/github/license/sebbejohansson/tcgpriser-js" alt="License"></a>
</p>

A typed Node.js / browser client for the [tcgpriser.se](https://tcgpriser.se) API: Pokémon TCG catalog data, price history, shop listings and bargains for shops tracked in Sweden.

## Features

- 🎯 **Fully typed**, straight off the API's own OpenAPI spec
- ⚡ **Async/await** on every method, no callbacks
- 🛠️ **Full IntelliSense** for every method and response field
- 📦 **Zero runtime dependencies**, built on the standard `fetch` API, ships as ESM and CJS
- 🔄 **Types stay in sync with the API**: `yarn generate:types` regenerates them from a live instance

## Installation

```bash
npm install tcgpriser
```
or with yarn
```bash
yarn add tcgpriser
```

Needs Node 18+ for global `fetch`, or pass your own `fetch` implementation (see [Options](#options)).

## Usage

```typescript
import { TcgPriser } from 'tcgpriser';

const tcgpriser = new TcgPriser();

const card = await tcgpriser.cards.get('mega-evolution-ascended-heroes-fezandipiti-ex');
console.log(card.retailPrice, card.lowestShopOffer?.shop.name);

const { data: bargains } = await tcgpriser.bargains.list({ type: 'card' });
```

Public methods need no token. A handful of premium methods do, see [Authentication](#authentication).

### Cards

```typescript
await tcgpriser.cards.list({ search: 'pikachu', limit: 10 });
await tcgpriser.cards.get('mega-evolution-ascended-heroes-fezandipiti-ex'); // id or technicalName
await tcgpriser.cards.matches('fezandipiti-ex', { inStock: true });
```

### Sealed products

Booster boxes, ETBs, tins and the like. Single cards live under `cards`, not here.

```typescript
await tcgpriser.products.list({ search: 'booster box' });
await tcgpriser.products.get('scarlet-violet-booster-pack');
await tcgpriser.products.matches('scarlet-violet-booster-pack');
```

### Expansions

```typescript
await tcgpriser.expansions.list();
await tcgpriser.expansions.products('eng-scarlet-violet-journey-together'); // { expansion, cards, sealed }
```

### Shops

```typescript
await tcgpriser.shops.list({ active: true });
await tcgpriser.shops.get('alphaspel');
await tcgpriser.shopMatches.forShop('alphaspel'); // everything currently listed there
```

### Price stats and bargains

```typescript
await tcgpriser.priceStats.daily({ technicalName: 'scarlet-violet-booster-pack' });
await tcgpriser.priceStats.estimatedValues({ expansion: 'eng-scarlet-violet-journey-together' });
await tcgpriser.bargains.list({ type: 'sealed' }); // 'sealed' | 'card' | 'all'
```

### Pack rates

```typescript
await tcgpriser.packRates.list();
await tcgpriser.packRates.get(expansionId);
```

## Available Methods

### `cards`

| Method | Description |
|---|---|
| `list(params)` | Search or list cards |
| `get(id)` | Fetch one card by id or technicalName |
| `matches(id, params)` | Current shop listings matched to this card |
| `prices(id, params)` 🔒 | Individual marketplace sale records |
| `referencePrices(id, params)` 🔒 | Cardmarket / TCGplayer / eBay / Tradera price history |
| `livePricing(id)` 🔒 | Pricing computed fresh for this request |

### `products`

| Method | Description |
|---|---|
| `list(params)` | Search or list sealed products |
| `get(id)` | Fetch one product by id or technicalName |
| `matches(id, params)` | Current shop listings matched to this product |
| `prices(id, params)` 🔒 | Individual marketplace sale records |
| `referencePrices(id, params)` 🔒 | Cardmarket / TCGplayer / Tradera price history |
| `livePricing(id)` 🔒 | Pricing computed fresh for this request |

### `expansions`

| Method | Description |
|---|---|
| `list()` | Every expansion |
| `products(technicalName)` | Every card and sealed product in one expansion |
| `livePricing(technicalName)` 🔒 | Fresh pricing for every item in one expansion |

### `shops`

| Method | Description |
|---|---|
| `list(params)` | Every tracked shop |
| `get(id)` | Fetch one shop by id or technicalName |

### `shopMatches`

| Method | Description |
|---|---|
| `list(params)` | Every current match across every shop |
| `forShop(shop, params)` | Everything currently listed at one shop |
| `shopStats(params)` | Match counts per shop |

### `shopMatchStats` 🔒

| Method | Description |
|---|---|
| `forProduct(id, params)` | One product's price history, broken out per shop |
| `forShop(shop, params)` | One shop's price history, broken out per product |
| `compare(params)` | One product's price at every shop that carries it |

### `priceStats`

| Method | Description |
|---|---|
| `daily(params)` | Daily average price history |
| `estimatedValues(params)` | Current estimated market value |
| `topProducts(params)` | Items ranked by shop availability |
| `product(id)` 🔒 | Daily history, estimate and variant summary for one product |
| `productFull(id)` 🔒 | `product()` plus the item's current shop matches |
| `productDaily(id, params)` 🔒 | Daily history for one product, custom window |
| `productDailyLast30(id)` 🔒 | Daily history, fixed to the last 30 days |
| `productEstimatedValue(id)` 🔒 | Current estimated value only |
| `productByVariant(id, params)` 🔒 | Price stats per card condition/grade |
| `productDailyByVariant(id, params)` 🔒 | Daily history for one condition/grade |

### `bargains`

| Method | Description |
|---|---|
| `list(params)` | Current listings priced below their reference price |
| `search(params)` 🔒 | Same, with real pagination and filters |

### `packRates`

| Method | Description |
|---|---|
| `list()` | Pull-rate odds for every expansion that has them |
| `get(expansionId)` | Pull-rate odds for one expansion |

### `shopUrls` 🔒

| Method | Description |
|---|---|
| `submit(params)` | Submit a shop URL for scraping |
| `assignProduct(id, params)` | Manually assign (or clear) the product a URL resolves to |

### `stats`

| Method | Description |
|---|---|
| `platform()` | Platform-wide overview counts |

🔒 = premium, needs a subscriber's token. See below.

## Authentication

Public methods work with no setup. Premium methods (marked 🔒 above) need a signed-in subscriber's JWT from tcgpriser.se. This package doesn't handle login itself; the site's sign-in is OAuth-based, so a headless client can't drive it. Pass a token your own app already has:

```typescript
const tcgpriser = new TcgPriser(myJwt); // shorthand for { authToken: myJwt }
await tcgpriser.cards.livePricing('fezandipiti-ex');
```

Or set no default and pass a token per call, which fits better when one client instance serves requests for many different signed-in users:

```typescript
const tcgpriser = new TcgPriser();
await tcgpriser.cards.livePricing('fezandipiti-ex', { authToken: requestUserJwt });
```

A missing or invalid token gets `401 unauthorized`. A valid token without an active subscription gets `403 premiumRequired`. Both come back as `TcgPriserError`:

```typescript
import { TcgPriser, TcgPriserError } from 'tcgpriser';

try {
  await tcgpriser.cards.get('does-not-exist');
} catch (error) {
  if (error instanceof TcgPriserError) {
    console.log(error.statusCode, error.code, error.message); // 404 'notFound' 'Card not found'
  }
}
```

## Options

```typescript
new TcgPriser(myJwt);  // shorthand for { authToken: myJwt }
new TcgPriser();       // no token, public methods only

new TcgPriser({
  authToken: myJwt,

  // Local dev, self-hosting or tests only. Leave this out for normal use.
  advanced: {
    baseUrl: 'https://api.tcgpriser.se', // default; point at a local dev server instead
    headers: { 'User-Agent': 'my-app/1.0' },
    fetch: myCustomFetch, // defaults to global fetch (Node 18+)
  },
});
```

## Types

Every response type is exported from the package root:

```typescript
import type { Card, SealedProduct, Bargain, ItemStats } from 'tcgpriser';
```

If you need the raw generated schema instead, it's exported too:

```typescript
import type { components } from 'tcgpriser';

type CardSchema = components['schemas']['CardWithPricing'];
```

Most types in `tcgpriser` are direct aliases onto that generated schema, so a field in your code and a field in the API docs are the same field, always.

## Scripts

### Build

```bash
yarn build
```

Bundles to `dist/` as ESM, CJS and `.d.ts` with `tsup`.

### Regenerate types

```bash
yarn generate:types
```

Regenerates `src/generated/openapi.d.ts` from a live API instance (defaults to `http://localhost:5000`, the local dev server). Committed to the repo, not gitignored. Regenerate it, review the diff, commit it, same as `pris-tabell-ui` does for its own generated types.

### Test

```bash
yarn test
```

`test/http.test.ts` runs against a mocked fetch. `test/live.test.ts` hits a real API instance and skips itself if nothing answers at `TCGPRISER_TEST_BASE_URL` (default `http://localhost:5000`), so the suite stays green with no server running.

### Example

```bash
yarn example
```

Runs `examples/basic.ts` against a local dev API. Set `TCGPRISER_AUTH_TOKEN` to see the premium call succeed instead of the expected 401.

## Scope

Covers the API's full documented surface: public catalog, price and bargain reads, plus the premium endpoints above. Not covered: the admin/scraper/auth surface, which isn't part of any published contract.

## License

MIT
