/**
 * Optional smoke test against a real API instance — not a mock. Points at
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
      console.warn(`[live.test] skipping — no server reachable at ${baseUrl}`);
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

    const cards = await client.cards.list({ limit: 1 });
    expect(cards.data.length).toBe(1);
    expect(cards.data[0]?.kind).toBe('card');

    const card = await client.cards.get(cards.data[0]!.technicalName);
    expect(card.id).toBe(cards.data[0]!.id);

    const products = await client.products.list({ limit: 1 });
    expect(products.data[0]?.kind).toBe('sealed');

    const bargains = await client.bargains.list();
    expect(bargains.pagination).toHaveProperty('total');

    const packRates = await client.packRates.list();
    expect(Array.isArray(packRates)).toBe(true);

    await expect(client.cards.get('this-technical-name-does-not-exist')).rejects.toMatchObject({
      statusCode: 404,
    });

    // Premium endpoints, hit with no authToken — there's no test subscriber account to log in as
    // here, so this only proves the request reaches the right route and the 401 comes back typed,
    // not that a real premium response parses correctly.
    await expect(client.cards.livePricing(cards.data[0]!.technicalName)).rejects.toMatchObject({
      statusCode: 401,
      code: 'unauthorized',
    });
    await expect(client.bargains.search()).rejects.toMatchObject({ statusCode: 401 });
  }, 20000);
});
