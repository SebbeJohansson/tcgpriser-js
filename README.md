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
console.log(card.name, card.expansion?.name);

// Content (name, images, expansion, ...) and pricing (retailPrice, lowestShopOffer, ...) are
// separate, differently-cached calls — see "Pricing" below.
const pricing = await tcgpriser.cards.pricing('mega-evolution-ascended-heroes-fezandipiti-ex');
console.log(pricing.retailPrice, pricing.lowestShopOffer?.shop.name);

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

Cards and sealed products are never merged into one response — fetch each separately.

```typescript
await tcgpriser.expansions.list();
await tcgpriser.expansions.get('eng-scarlet-violet-journey-together'); // metadata only
await tcgpriser.expansions.cards('eng-scarlet-violet-journey-together'); // content only
await tcgpriser.expansions.sealedProducts('eng-scarlet-violet-journey-together'); // content only
```

### Pricing

`list()`/`get()`/`expansions.cards()`/`expansions.sealedProducts()` all return catalog content
only — name, images, brand, expansion, rarity. Pricing (`retailPrice`, `estimatedValue`,
`lowestShopOffer`, `referencePriceSnapshotsByProvider`) is a separate, shorter-cached call: content changes on an
admin edit or catalog import, pricing refreshes daily, so each is cached at the TTL its own
freshness supports.

```typescript
await tcgpriser.cards.pricing('fezandipiti-ex'); // id or technicalName
await tcgpriser.products.pricing('scarlet-violet-booster-pack');

// Batch form, up to 200 ids at once — ids only, not technicalNames.
const { data: cards } = await tcgpriser.cards.list({ search: 'pikachu' });
await tcgpriser.cards.pricingBatch(cards.map((card) => card.id));
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

| Method | Description | Credits |
|---|---|---|
| `list(params)` | Search or list cards | — |
| `get(id)` | Fetch one card by id or technicalName | — |
| `matches(id, params)` | Current shop listings matched to this card | — |
| `prices(id, params)` 🔒 | Individual marketplace sale records | 2 |
| `referencePrices(id, params)` 🔒 | Cardmarket / TCGplayer / eBay / Tradera price history | 2 |
| `livePricing(id)` 🔒 | Pricing computed fresh for this request | 3 |

### `products`

| Method | Description | Credits |
|---|---|---|
| `list(params)` | Search or list sealed products | — |
| `get(id)` | Fetch one product by id or technicalName | — |
| `matches(id, params)` | Current shop listings matched to this product | — |
| `prices(id, params)` 🔒 | Individual marketplace sale records | 2 |
| `referencePrices(id, params)` 🔒 | Cardmarket / TCGplayer / Tradera price history | 2 |
| `livePricing(id)` 🔒 | Pricing computed fresh for this request | 3 |

### `expansions`

| Method | Description | Credits |
|---|---|---|
| `list()` | Every expansion | — |
| `products(technicalName)` | Every card and sealed product in one expansion | — |
| `livePricing(technicalName)` 🔒 | Fresh pricing for every item in one expansion | 8 |

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

| Method | Description | Credits |
|---|---|---|
| `forProduct(id, params)` | One product's price history, broken out per shop | 3 |
| `forShop(shop, params)` | One shop's price history, broken out per product | 3 |
| `compare(params)` | One product's price at every shop that carries it | 3 |

### `priceStats`

| Method | Description | Credits |
|---|---|---|
| `daily(params)` | Daily average price history | — |
| `estimatedValues(params)` | Current estimated market value | — |
| `topProducts(params)` | Items ranked by shop availability | — |
| `product(id)` 🔒 | Daily history, estimate and variant summary for one product | 2 |
| `productFull(id)` 🔒 | `product()` plus the item's current shop matches | 5 |
| `productDaily(id, params)` 🔒 | Daily history for one product, custom window | 1 |
| `productDailyLast30(id)` 🔒 | Daily history, fixed to the last 30 days | 1 |
| `productEstimatedValue(id)` 🔒 | Current estimated value only | 2 |
| `productByVariant(id, params)` 🔒 | Price stats per card condition/grade | 3 |
| `productDailyByVariant(id, params)` 🔒 | Daily history for one condition/grade | 1 |

### `bargains`

| Method | Description | Credits |
|---|---|---|
| `list(params)` | Current listings priced below their reference price | — |
| `search(params)` 🔒 | Same, with real pagination and filters | 5 |

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

🔒 = premium, needs an API token. See below. The Credits column applies only to methods that draw
from your weekly credit allowance when called with an API token. A session login (not available to
this client) and `shopUrls` are exempt. See [Credits](#credits).

## Authentication

Public methods work with no setup. Premium methods (marked 🔒 above) need a Premium subscriber's API token, generated from **tcgpriser.se/account/api-token**. Unlike the site's own session login, which is OAuth-based and can't be driven headlessly, the API token is a long-lived, revocable secret made specifically for scripts and other programmatic callers. Generate it once from your account page and pass it in:

```typescript
const tcgpriser = new TcgPriser(myApiToken); // shorthand for { authToken: myApiToken }
await tcgpriser.cards.livePricing('fezandipiti-ex');
```

Or set no default and pass a token per call, which fits better when one client instance serves requests for many different signed-in users:

```typescript
const tcgpriser = new TcgPriser();
await tcgpriser.cards.livePricing('fezandipiti-ex', { authToken: requestUserApiToken });
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

## Credits

Methods marked with a credit count in the tables above draw from your account's weekly credit
allowance when called with an API token (Premium: 1500/week, Business: 6000/week, both reset Monday
00:00 UTC). Cost is weighted by how much work the call does server-side: a cached single-item lookup
costs less than a whole-expansion recompute. `expansions.livePricing` is the most expensive call in
the API at 8 credits, since it recomputes pricing for every card or product in the set.

Once the week's credits run out, further calls reject with `429 creditsExhausted`, surfaced the same
way as any other error:

```typescript
try {
  await tcgpriser.cards.livePricing('fezandipiti-ex');
} catch (error) {
  if (error instanceof TcgPriserError && error.code === 'creditsExhausted') {
    console.log('Out of credits for this week:', error.message);
  }
}
```

This client doesn't currently surface the `X-Credits-Remaining` response header. To track your
remaining balance mid-week, read it off the raw HTTP response yourself outside this SDK, or poll
`GET /subscription` on the main API.

## Options

```typescript
new TcgPriser(myApiToken);  // shorthand for { authToken: myApiToken }
new TcgPriser();            // no token, public methods only

new TcgPriser({
  authToken: myApiToken,

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

## Images

`imageUrl`, `logoUrl` and `symbolUrl` fields point at tcgpriser.se's own CDN, which is sized for
tcgpriser.se's own traffic, not for hotlinking from other sites and apps. **For best performance,
rehost these images on your own storage/CDN and cache them there** instead of linking to them
directly — one less hop, tuned to your own traffic and geography, and no dependency on
infrastructure that isn't yours.

A simple way to do this: fetch the image once, save it under the URL's path (e.g.
`products/eng-scarlet-violet-booster-pack.png`) as a stable local key, serve it from your own
storage from then on, and periodically re-fetch (a nightly job is plenty) using a conditional
`GET` so you only pay for images that actually changed:

```typescript
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const etags = new Map<string, string>(); // persist this however you persist anything else

async function rehostImage(imageUrl: string, cacheDir: string): Promise<string> {
  const key = new URL(imageUrl).pathname.replace(/^\/[^/]+\//, ''); // "products/....webp"
  const localPath = join(cacheDir, key);
  const knownEtag = etags.get(key);

  const res = await fetch(imageUrl, { headers: knownEtag ? { 'If-None-Match': knownEtag } : {} });
  if (res.status === 304) return localPath; // unchanged since last sync

  if (!res.ok) throw new Error(`Failed to fetch ${imageUrl}: ${res.status}`);
  await mkdir(dirname(localPath), { recursive: true });
  await writeFile(localPath, Buffer.from(await res.arrayBuffer()));

  const etag = res.headers.get('etag');
  if (etag) etags.set(key, etag);
  return localPath;
}
```

Swap the `fs`/`mkdir`/`writeFile` calls for your own storage's SDK (S3, R2, Cloudflare Images, ...)
if you're not caching to local disk. See `examples/rehost-images.ts` for a runnable version of this
against a live `tcgpriser` response.

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

```bash
yarn example:rehost-images
```

Runs `examples/rehost-images.ts` — the "Images" section's rehosting pattern against a handful of real product images. Run it twice to see the second pass come back as `304`s.

## Scope

Covers the API's full documented surface: public catalog, price and bargain reads, plus the premium endpoints above. Not covered: the admin/scraper/auth surface, which isn't part of any published contract.

## License

MIT
