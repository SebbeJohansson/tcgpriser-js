/**
 * URL and query shape for the market-intelligence resources.
 *
 * A resource method whose only job is to build a URL fails quietly when it builds the wrong one:
 * the call still returns a well-formed response, just for a different question. These pin the paths
 * and the parameter names, including the two places where a card call and a sealed call must not be
 * allowed to converge.
 */

import { describe, expect, it } from 'vitest';
import { TcgPriser } from '../src/client.js';

function clientCapturing(capture: (url: string) => void): TcgPriser {
  return new TcgPriser({
    advanced: {
      baseUrl: 'http://localhost:5000',
      fetch: (async (input: string | URL | Request) => {
        capture(String(input));
        return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
      }) as typeof fetch,
    },
  });
}

describe('market movers', () => {
  it('ranks cards and sealed products on separate paths', async () => {
    const urls: string[] = [];
    const client = clientCapturing((url) => urls.push(url));

    await client.cards.marketMovers();
    await client.products.marketMovers();

    expect(urls[0]).toBe('http://localhost:5000/cards/price-stats/market-movers');
    expect(urls[1]).toBe('http://localhost:5000/product/price-stats/market-movers');
  });

  it('passes every leaderboard option through as a query parameter', async () => {
    let captured = '';
    const client = clientCapturing((url) => {
      captured = url;
    });

    await client.cards.marketMovers({
      mover: 'topDroppersAmount',
      days: 30,
      minPrice: 0,
      expansion: 'eng-surging-sparks',
      limit: 10,
      skip: 20,
    });

    const query = new URL(captured).searchParams;
    expect(query.get('mover')).toBe('topDroppersAmount');
    expect(query.get('days')).toBe('30');
    // 0 is a meaningful floor ("show me the noise"), so it must survive rather than being dropped
    // as falsy alongside undefined.
    expect(query.get('minPrice')).toBe('0');
    expect(query.get('expansion')).toBe('eng-surging-sparks');
    expect(query.get('limit')).toBe('10');
    expect(query.get('skip')).toBe('20');
  });

  it('sends no query at all when nothing is set, so the response stays cacheable', async () => {
    let captured = '';
    const client = clientCapturing((url) => {
      captured = url;
    });

    await client.products.marketMovers();

    expect(captured).not.toContain('?');
  });
});

describe('expansion expected value', () => {
  it('addresses the expansion by technicalName', async () => {
    let captured = '';
    const client = clientCapturing((url) => {
      captured = url;
    });

    await client.expansions.expectedValue('jpn-mega-evolution-30th-celebration');

    expect(captured).toBe(
      'http://localhost:5000/expansions/jpn-mega-evolution-30th-celebration/expected-value',
    );
  });

  it('escapes a slug rather than letting it alter the path', async () => {
    let captured = '';
    const client = clientCapturing((url) => {
      captured = url;
    });

    await client.expansions.expectedValue('a/b');

    expect(captured).toBe('http://localhost:5000/expansions/a%2Fb/expected-value');
  });
});

describe('grading ROI', () => {
  it('sends no cost parameters when none were given', async () => {
    let captured = '';
    const client = clientCapturing((url) => {
      captured = url;
    });

    await client.cards.gradingRoi('charizard-ex');

    // Without costs the API returns the graded multiple and leaves profit null. Inventing a default
    // grading fee here would silently turn that into a profit figure nobody stated the inputs for.
    expect(captured).toBe('http://localhost:5000/cards/charizard-ex/grading-roi');
  });

  it('passes the caller stated costs through', async () => {
    let captured = '';
    const client = clientCapturing((url) => {
      captured = url;
    });

    await client.cards.gradingRoi('charizard-ex', {
      days: 180,
      gradingCostSek: 250,
      shippingCostSek: 50,
      salesFeePercent: 10,
    });

    const query = new URL(captured).searchParams;
    expect(query.get('days')).toBe('180');
    expect(query.get('gradingCostSek')).toBe('250');
    expect(query.get('shippingCostSek')).toBe('50');
    expect(query.get('salesFeePercent')).toBe('10');
  });
});
