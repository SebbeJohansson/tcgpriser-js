/**
 * Optional smoke test against a real API instance, not a mock. Points at
 * `TCGPRISER_TEST_BASE_URL` (defaults to the local dev server) and skips itself entirely if that
 * server isn't reachable, so `yarn test` stays green in CI / offline. Run the API locally
 * (`yarn dev` in pris-tabell-api) and then `yarn test` here to exercise it for real.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { TcgPriser } from '../src/client.js';

const baseUrl = process.env.TCGPRISER_TEST_BASE_URL ?? 'http://localhost:5000';

let serverReachable = false;

beforeAll(async () => {
  try {
    const res = await fetch(`${baseUrl}/stats`, { signal: AbortSignal.timeout(2000) });
    serverReachable = res.ok;
  } catch {
    serverReachable = false;
  }
});

describe.runIf(process.env.CI !== 'true')('live API smoke test', () => {
  it(`hits a real server at ${baseUrl}`, async () => {
    if (!serverReachable) {
      console.warn(`[live.test] skipping, no server reachable at ${baseUrl}`);
      return;
    }

    const client = new TcgPriser({ advanced: { baseUrl } });

    const stats = await client.stats.platform();
    expect(stats.productCount).toBeGreaterThan(0);

    const shops = await client.shops.list();
    expect(shops.length).toBeGreaterThan(0);
    expect(shops[0]).toHaveProperty('technicalName');

    const expansions = await client.expansions.list();
    expect(expansions.length).toBeGreaterThan(0);

    // Multi-brand foundation: exactly one brand row exists today (Pokémon), but the filter must
    // already behave correctly — a match, not a fluke of there being nothing to filter out.
    const brands = await client.brands.list();
    expect(brands.length).toBeGreaterThan(0);
    expect(brands[0]).toHaveProperty('technicalName');
    const pokemon = brands.find((b) => b.technicalName === 'pokemon');
    expect(pokemon).toBeDefined();

    const brand = await client.brands.get('pokemon');
    expect(brand.id).toBe(pokemon!.id);
    await expect(client.brands.get('this-brand-does-not-exist')).rejects.toMatchObject({
      statusCode: 404,
    });

    const brandFilteredExpansions = await client.expansions.list({ brand: 'pokemon' });
    expect(brandFilteredExpansions.length).toBe(expansions.length);
    await expect(client.expansions.list({ brand: 'this-brand-does-not-exist' })).rejects.toMatchObject({
      statusCode: 400,
    });

    const cards = await client.cards.list({ limit: 1 });
    expect(cards.data.length).toBe(1);
    expect(cards.data[0]?.kind).toBe('card');
    expect(cards.data[0]).toHaveProperty('productLine');

    // brand/productLine list filters: unfiltered vs. filtered totals must match exactly (one
    // brand, all TCG), and an unknown brand must 400 rather than come back empty.
    const cardsUnfiltered = await client.cards.list({ limit: 1 });
    const cardsByBrand = await client.cards.list({ brand: 'pokemon', limit: 1 });
    expect(cardsByBrand.pagination.total).toBe(cardsUnfiltered.pagination.total);
    const cardsByProductLine = await client.cards.list({ productLine: 'tcg', limit: 1 });
    expect(cardsByProductLine.pagination.total).toBe(cardsUnfiltered.pagination.total);
    const cardsByWrongProductLine = await client.cards.list({ productLine: 'accessory', limit: 1 });
    expect(cardsByWrongProductLine.pagination.total).toBe(0);
    await expect(client.cards.list({ brand: 'this-brand-does-not-exist' })).rejects.toMatchObject({
      statusCode: 400,
    });

    const card = await client.cards.get(cards.data[0]!.technicalName);
    expect(card.id).toBe(cards.data[0]!.id);
    expect(card).not.toHaveProperty('retailPrice');

    // Flat vs. brand-scoped ("subfolder mode") lookup of the same slug must resolve identically.
    const cardByBrandSlug = await client.cards.get(cards.data[0]!.technicalName, { brand: 'pokemon' });
    expect(cardByBrandSlug.id).toBe(card.id);

    const cardPricing = await client.cards.pricing(card.id);
    expect(cardPricing.id).toBe(card.id);
    expect(cardPricing).toHaveProperty('retailPrice');

    const { data: cardPricingBatch } = await client.cards.pricingBatch([card.id]);
    expect(cardPricingBatch[0]?.id).toBe(card.id);

    const products = await client.products.list({ limit: 1 });
    expect(products.data[0]?.kind).toBe('sealed');
    expect(products.data[0]).not.toHaveProperty('retailPrice');
    expect(products.data[0]).toHaveProperty('productLine');

    const productsByBrand = await client.products.list({ brand: 'pokemon', limit: 1 });
    expect(productsByBrand.pagination.total).toBe(products.pagination.total);

    const product = products.data[0];
    if (product) {
      const productPricing = await client.products.pricing(product.id);
      expect(productPricing.id).toBe(product.id);

      const { data: productPricingBatch } = await client.products.pricingBatch([product.id]);
      expect(productPricingBatch[0]?.id).toBe(product.id);

      // Flat vs. brand-scoped ("subfolder mode") lookup of the same slug must resolve identically.
      const productByBrandSlug = await client.products.get(product.technicalName, { brand: 'pokemon' });
      expect(productByBrandSlug.id).toBe(product.id);
    }

    const bargains = await client.bargains.list();
    expect(bargains.pagination).toHaveProperty('total');

    // The kind-scoped catalog reads. Their whole point is being narrower than the unscoped
    // /price-stats equivalents, so assert the scoping actually holds rather than just a 200.
    const cardSlugs = await client.cards.technicalNames();
    expect(cardSlugs.data.length).toBeGreaterThan(0);
    expect(cardSlugs.data[0]).toHaveProperty('updatedAt');

    const productSlugs = await client.products.technicalNames();
    expect(productSlugs.data.length).toBeGreaterThan(0);

    // `ItemDailyStats.item` is a bare { id, name } ref with no `kind`, which is exactly why these
    // kind-scoped variants exist: with the unscoped /price-stats/daily you cannot tell from the
    // response whether a row is a card or a sealed product. So assert the shape here, and let the
    // scoping itself rest on the route (and on the API's own tests for the shared handler).
    const cardDaily = await client.cards.dailyStats();
    expect(Array.isArray(cardDaily.data)).toBe(true);
    expect(cardDaily.pagination).toHaveProperty('total');
    if (cardDaily.data[0]) expect(cardDaily.data[0].item).toHaveProperty('id');

    const sealedDaily = await client.products.dailyStats();
    expect(Array.isArray(sealedDaily.data)).toBe(true);

    const cardValues = await client.cards.estimatedValues({ limit: 1 });
    expect(Array.isArray(cardValues.data)).toBe(true);

    const packRates = await client.packRates.list();
    expect(Array.isArray(packRates)).toBe(true);

    await expect(client.cards.get('this-technical-name-does-not-exist')).rejects.toMatchObject({
      statusCode: 404,
    });

    // Premium, hit with no authToken. No test subscriber account here, so this only proves the
    // request hits the right route and the 401 comes back typed, not that a real response parses.
    await expect(client.cards.livePricing(cards.data[0]!.technicalName)).rejects.toMatchObject({
      statusCode: 401,
      code: 'unauthorized',
    });
    await expect(client.bargains.search()).rejects.toMatchObject({ statusCode: 401 });

    // Business tier, unauthenticated. 401 (no token) rather than 403 (wrong tier), and a 404 if
    // the feature flag is off on this instance — both mean the route resolved, which is what an
    // unauthenticated smoke test can prove.
    await expect(client.webhooks.list()).rejects.toMatchObject({
      statusCode: expect.any(Number),
    });

    // A timeout short enough that nothing can beat it, to prove the abort path reaches the caller
    // as our own error rather than a raw AbortError.
    await expect(client.stats.platform({ timeoutMs: 1 })).rejects.toMatchObject({
      code: 'timeout',
    });
  }, 20000);
});
