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
- ⏱️ **Timeouts and `AbortSignal`** on every call, with a sane default rather than none
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
await tcgpriser.cards.list({ limit: 10 }); // newest first, no free-text search
await tcgpriser.cards.search({ search: 'pikachu' }); // premium
await tcgpriser.cards.get('mega-evolution-ascended-heroes-fezandipiti-ex'); // id or technicalName
await tcgpriser.cards.matches('fezandipiti-ex', { inStock: true });
```

### Sealed products

Booster boxes, ETBs, tins and the like. Single cards live under `cards`, not here.

```typescript
await tcgpriser.products.list({ limit: 10 }); // newest first, no free-text search
await tcgpriser.products.search({ search: 'booster box' }); // premium
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
const { data: cards } = await tcgpriser.cards.list({ limit: 20 });
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

`priceStats` covers cards and sealed products together. To scope to one kind — so an `expansion`
filter doesn't pull in that set's single cards alongside its booster boxes — use the equivalents on
`cards` and `products`:

```typescript
await tcgpriser.cards.dailyStats({ expansion: 'eng-scarlet-violet-journey-together' });
await tcgpriser.products.estimatedValues({ expansion: 'eng-scarlet-violet-journey-together' });
```

### Enumerating the catalog

`technicalNames()` returns every slug with its `updatedAt` and nothing else — no pricing joins, no
paging through full documents. It's what you want for a sitemap, or to work out which items have
changed since your last sync:

```typescript
const { data: slugs } = await tcgpriser.cards.technicalNames();
const stale = slugs.filter((slug) => slug.updatedAt > lastSyncedAt);
```

### Pack rates

```typescript
await tcgpriser.packRates.list();
await tcgpriser.packRates.get(expansionId);
```

## Available Methods

🔒 = premium, 🏢 = business. Both need an API token — see [Authentication](#authentication). The
Credits column applies only to calls that draw from your weekly allowance; see [Credits](#credits).

### `cards`

| Method | Description | Credits |
|---|---|---|
| `list(params)` | List cards, newest first | — |
| `search(params)` 🔒 | Free-text search on card and set names | 5 |
| `get(id)` | Fetch one card by id or technicalName | — |
| `matches(id, params)` | Current shop listings matched to this card | — |
| `pricing(id)` | This card's current pricing snapshot | — |
| `pricingBatch(ids)` | Pricing for up to 200 cards at once, by id | — |
| `technicalNames()` | Every card's slug and `updatedAt`, for sitemaps and syncs | — |
| `dailyStats(params)` | Daily average price history, cards only | — |
| `estimatedValues(params)` | Current estimated market value, cards only | — |
| `prices(id, params)` 🔒 | Individual marketplace sale records | 2 |
| `referencePrices(id, params)` 🔒 | Cardmarket / TCGplayer / eBay / Tradera price history | 2 |
| `livePricing(id)` 🔒 | Pricing computed fresh for this request | 3 |

### `products`

Sealed products only. Single cards live under `cards`.

| Method | Description | Credits |
|---|---|---|
| `list(params)` | List sealed products, newest first | — |
| `search(params)` 🔒 | Free-text search on the product name | 5 |
| `get(id)` | Fetch one product by id or technicalName | — |
| `matches(id, params)` | Current shop listings matched to this product | — |
| `pricing(id)` | This product's current pricing snapshot | — |
| `pricingBatch(ids)` | Pricing for up to 200 products at once, by id | — |
| `technicalNames()` | Every product's slug and `updatedAt` | — |
| `dailyStats(params)` | Daily average price history, sealed only | — |
| `estimatedValues(params)` | Current estimated market value, sealed only | — |
| `prices(id, params)` 🔒 | Individual marketplace sale records | 2 |
| `referencePrices(id, params)` 🔒 | Cardmarket / TCGplayer / Tradera price history | 2 |
| `livePricing(id)` 🔒 | Pricing computed fresh for this request | 3 |

### `expansions`

Cards and sealed products are always separate calls — nothing here merges them.

| Method | Description | Credits |
|---|---|---|
| `list()` | Every expansion, with counts | — |
| `get(technicalName)` | One expansion's metadata (no contents) | — |
| `cards(technicalName)` | Every card in the expansion, content only | — |
| `sealedProducts(technicalName)` | Every sealed product in the expansion, content only | — |
| `cardsLivePricing(technicalName)` 🔒 | Fresh pricing for every card in the expansion | 8 |
| `productsLivePricing(technicalName)` 🔒 | Fresh pricing for every sealed product in it | 8 |

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

`daily()` and `estimatedValues()` cover cards and sealed products together. For one or the other,
use `cards.dailyStats()` / `products.dailyStats()` and their `estimatedValues()` counterparts.

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

### `webhooks` 🏢

Business tier. See [Webhooks](#webhooks) below.

| Method | Description |
|---|---|
| `create(params)` | Register a webhook; returns its signing secret once |
| `list()` | Every webhook on the account |
| `delete(id)` | Revoke a webhook |
| `test(id)` | Send a sample delivery |

### `stats`

| Method | Description |
|---|---|
| `platform()` | Platform-wide overview counts |

Every method also takes `signal` and `timeoutMs` — see [Timeouts and cancellation](#timeouts-and-cancellation).

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
costs less than a whole-expansion recompute. `expansions.cardsLivePricing()` and
`expansions.productsLivePricing()` are the most expensive calls in the API at 8 credits, since each
recomputes pricing for every item in the set.

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

To track your balance mid-week, read `creditsRemaining` off the client. It's updated from the
`X-Credits-Remaining` header the API returns on every charged response, so it costs no extra
request — but it's only as current as your last premium call, and `undefined` until you make one:

```typescript
await tcgpriser.cards.livePricing('fezandipiti-ex');
console.log(tcgpriser.creditsRemaining); // 1487
```

It's also on the error, which is where it matters most:

```typescript
catch (error) {
  if (error instanceof TcgPriserError && error.code === 'creditsExhausted') {
    console.log(error.creditsRemaining); // 0
  }
}
```

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
    timeoutMs: 60_000,    // default; 0 disables the timeout entirely
  },
});
```

## Timeouts and cancellation

Every method takes `timeoutMs` and `signal`, either as a second argument or alongside the other
params:

```typescript
await tcgpriser.cards.get('fezandipiti-ex', { timeoutMs: 5000 });
await tcgpriser.cards.list({ limit: 10, timeoutMs: 5000 });
```

Requests time out after 60 seconds by default. A timeout rejects with a `TcgPriserError` whose
`code` is `'timeout'` — the one code this package raises itself, so a stalled connection is always
distinguishable from a server that actually answered:

```typescript
try {
  await tcgpriser.expansions.cardsLivePricing('eng-scarlet-violet-journey-together');
} catch (error) {
  if (error instanceof TcgPriserError && error.code === 'timeout') {
    // A whole-expansion recompute on a large set is the one call worth raising the limit for.
    await tcgpriser.expansions.cardsLivePricing('eng-scarlet-violet-journey-together', {
      timeoutMs: 0, // no timeout
    });
  }
}
```

Pass a `signal` to cancel from outside — a user navigating away, a request being abandoned. Whichever
fires first wins, and aborting through your own signal rejects with the standard `AbortError` rather
than a `TcgPriserError`, since that's you getting what you asked for:

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 1000);
await tcgpriser.cards.list({ limit: 10, signal: controller.signal });
```

## Rate limits

Anonymous traffic is capped per IP, and premium reads per token (Premium 30/min, Business 120/min).
Going over rejects with `429 rateLimited`, carrying the seconds to wait:

```typescript
if (error instanceof TcgPriserError && error.code === 'rateLimited') {
  await sleep((error.retryAfter ?? 60) * 1000);
}
```

## Webhooks

Business tier only — a Premium token gets `403 businessRequired`. Instead of polling, the API POSTs
to a URL you register when a catalog event fires.

```typescript
const tcgpriser = new TcgPriser(myBusinessApiToken);

const webhook = await tcgpriser.webhooks.create({
  url: 'https://example.com/hooks/tcgpriser', // must be https
  events: ['price.updated', 'bargain.found'],
});

// The only time you will ever see this. Store it now — deliveries are signed with it, and no
// endpoint reads it back. Lost it? Delete the webhook and register a new one.
await saveSecret(webhook.secret);

await tcgpriser.webhooks.test(webhook.id); // sample delivery, so you can verify your endpoint
await tcgpriser.webhooks.list();           // never includes secrets
await tcgpriser.webhooks.delete(webhook.id);
```

Available events: `price.updated`, `bargain.found`, `product.created`, `card.created`.

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

Covers everything on the API's two published documentation pages: the public catalog, price and
bargain reads at [/docs](https://api.tcgpriser.se/docs), and the premium and business endpoints at
[/premium-docs](https://api.tcgpriser.se/premium-docs).

Not covered, deliberately:

- **The admin, scraper and ingest surface.** Ours, not a customer's — no API token reaches it, and
  it isn't part of any published contract.
- **Account management** (login, subscriptions, API-token minting, referrals). These authenticate
  with the website's session JWT, which comes from an OAuth flow this client can't drive. Generate
  your API token from your account page instead.
- **`/bulk-export`.** Feeds our own static build, answers a non-standard shape, and is not
  documented for third parties. Page the documented endpoints instead.

## License

MIT
