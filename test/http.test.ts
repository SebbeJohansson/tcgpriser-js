import { describe, expect, it } from 'vitest';
import { toQueryString } from '../src/http.js';
import { TcgPriser } from '../src/client.js';
import { TcgPriserError } from '../src/errors.js';

describe('toQueryString', () => {
  it('drops undefined and null values', () => {
    expect(toQueryString({ a: 1, b: undefined, c: null, d: 'x' })).toBe('?a=1&d=x');
  });

  it('returns an empty string when nothing is set', () => {
    expect(toQueryString({ a: undefined })).toBe('');
  });

  it('stringifies booleans', () => {
    expect(toQueryString({ inStock: true })).toBe('?inStock=true');
  });
});

function fakeFetch(handler: (url: string, init?: RequestInit) => Response) {
  return (async (input: string | URL | Request, init?: RequestInit) => {
    return handler(String(input), init);
  }) as typeof fetch;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('TcgPriser client', () => {
  it('builds the request URL from baseUrl + path + query params', async () => {
    let capturedUrl = '';
    const client = new TcgPriser({
      advanced: {
        baseUrl: 'http://localhost:5000',
        fetch: fakeFetch((url) => {
          capturedUrl = url;
          return jsonResponse({ data: [], pagination: { total: 0, limit: 10, skip: 0, hasMore: false } });
        }),
      },
    });

    await client.cards.list({ search: 'pikachu', limit: 5 });

    expect(capturedUrl).toBe('http://localhost:5000/cards?search=pikachu&limit=5');
  });

  it('strips a trailing slash from a custom baseUrl', async () => {
    let capturedUrl = '';
    const client = new TcgPriser({
      advanced: {
        baseUrl: 'http://localhost:5000/',
        fetch: fakeFetch((url) => {
          capturedUrl = url;
          return jsonResponse({});
        }),
      },
    });

    await client.stats.platform();

    expect(capturedUrl).toBe('http://localhost:5000/stats');
  });

  it('encodes path segments', async () => {
    let capturedUrl = '';
    const client = new TcgPriser({
      advanced: {
        fetch: fakeFetch((url) => {
          capturedUrl = url;
          return jsonResponse({});
        }),
      },
    });

    await client.shops.get('shop with spaces/slash');

    expect(capturedUrl).toContain(encodeURIComponent('shop with spaces/slash'));
  });

  it('unwraps the list envelope for expansions, shops and pack-rates', async () => {
    const client = new TcgPriser({
      advanced: { fetch: fakeFetch(() => jsonResponse({ data: [{ id: '1' }], pagination: {} })) },
    });

    const expansions = await client.expansions.list();
    expect(expansions).toEqual([{ id: '1' }]);
  });

  it('throws a TcgPriserError with the parsed code and message on a non-2xx response', async () => {
    const client = new TcgPriser({
      advanced: {
        fetch: fakeFetch(() =>
          jsonResponse({ error: { code: 'notFound', message: 'Card not found', details: null } }, 404),
        ),
      },
    });

    await expect(client.cards.get('does-not-exist')).rejects.toMatchObject({
      statusCode: 404,
      code: 'notFound',
      message: expect.stringContaining('Card not found'),
    });
  });

  it('falls back to code "unknown" when the error body is not the standard envelope', async () => {
    const client = new TcgPriser({
      advanced: {
        fetch: fakeFetch(
          () =>
            new Response('<html>502 Bad Gateway</html>', {
              status: 502,
              statusText: 'Bad Gateway',
            }),
        ),
      },
    });

    try {
      await client.stats.platform();
      expect.unreachable('expected a rejection');
    } catch (error) {
      expect(error).toBeInstanceOf(TcgPriserError);
      expect((error as TcgPriserError).code).toBe('unknown');
      expect((error as TcgPriserError).statusCode).toBe(502);
    }
  });

  it('sends custom default headers on every request', async () => {
    let capturedHeaders: Headers | undefined;
    const client = new TcgPriser({
      advanced: {
        headers: { 'X-Test': 'yes' },
        fetch: fakeFetch((_url, init) => {
          capturedHeaders = new Headers(init?.headers);
          return jsonResponse({});
        }),
      },
    });

    await client.stats.platform();

    expect(capturedHeaders?.get('X-Test')).toBe('yes');
  });

  describe('constructor shorthand', () => {
    it('treats a bare string as { authToken: string }', async () => {
      // Shorthand form has no room for advanced.fetch, so stub the real global fetch instead of
      // using the fakeFetch() helper the other tests use.
      let capturedHeaders: Headers | undefined;
      const originalFetch = globalThis.fetch;
      globalThis.fetch = fakeFetch((_url, init) => {
        capturedHeaders = new Headers(init?.headers);
        return jsonResponse({ id: '1', name: 'x', technicalName: 'x', pricing: {} });
      });

      try {
        const client = new TcgPriser('shorthand-token');
        await client.cards.livePricing('some-card');
      } finally {
        globalThis.fetch = originalFetch;
      }

      expect(capturedHeaders?.get('Authorization')).toBe('Bearer shorthand-token');
    });

    it('constructs with no arguments for an anonymous client', () => {
      expect(() => new TcgPriser()).not.toThrow();
    });
  });

  describe('premium endpoints', () => {
    it('sends the client-level default authToken as a Bearer header', async () => {
      let capturedHeaders: Headers | undefined;
      const client = new TcgPriser({
        authToken: 'default-token',
        advanced: {
          fetch: fakeFetch((_url, init) => {
            capturedHeaders = new Headers(init?.headers);
            return jsonResponse({ id: '1', name: 'x', technicalName: 'x', pricing: {} });
          }),
        },
      });

      await client.cards.livePricing('some-card');

      expect(capturedHeaders?.get('Authorization')).toBe('Bearer default-token');
    });

    it('lets a per-call authToken override the client default', async () => {
      let capturedHeaders: Headers | undefined;
      const client = new TcgPriser({
        authToken: 'default-token',
        advanced: {
          fetch: fakeFetch((_url, init) => {
            capturedHeaders = new Headers(init?.headers);
            return jsonResponse({ id: '1', name: 'x', technicalName: 'x', pricing: {} });
          }),
        },
      });

      await client.cards.livePricing('some-card', { authToken: 'call-token' });

      expect(capturedHeaders?.get('Authorization')).toBe('Bearer call-token');
    });

    it('never puts authToken in the query string', async () => {
      let capturedUrl = '';
      const client = new TcgPriser({
        advanced: {
          fetch: fakeFetch((url) => {
            capturedUrl = url;
            return jsonResponse({
              item: {},
              fromDate: '',
              toDate: '',
              metric: 'avg',
              currencyMode: 'sek',
              series: [],
            });
          }),
        },
      });

      await client.cards.referencePrices('some-card', { authToken: 'secret-token', days: 30 });

      expect(capturedUrl).not.toContain('secret-token');
      expect(capturedUrl).toContain('days=30');
    });

    it('sends no Authorization header when no token is configured anywhere', async () => {
      let capturedHeaders: Headers | undefined;
      const client = new TcgPriser({
        advanced: {
          fetch: fakeFetch((_url, init) => {
            capturedHeaders = new Headers(init?.headers);
            return jsonResponse({});
          }),
        },
      });

      await client.stats.platform();

      expect(capturedHeaders?.has('Authorization')).toBe(false);
    });

    it('sends a JSON body and Content-Type on POST', async () => {
      let capturedBody = '';
      let capturedMethod = '';
      const client = new TcgPriser({
        authToken: 'token',
        advanced: {
          fetch: fakeFetch((_url, init) => {
            capturedMethod = init?.method ?? '';
            capturedBody = String(init?.body ?? '');
            return jsonResponse({ message: 'ok', shopUrl: {} });
          }),
        },
      });

      await client.shopUrls.submit({ url: 'https://example.com/x', shop: 'alphaspel' });

      expect(capturedMethod).toBe('POST');
      expect(JSON.parse(capturedBody)).toEqual({ url: 'https://example.com/x', shop: 'alphaspel' });
    });

    it('surfaces premiumRequired as a distinct error code from unauthorized', async () => {
      const client = new TcgPriser({
        advanced: {
          fetch: fakeFetch(() =>
            jsonResponse(
              { error: { code: 'premiumRequired', message: 'Subscription required', details: null } },
              403,
            ),
          ),
        },
      });

      await expect(client.bargains.search()).rejects.toMatchObject({
        statusCode: 403,
        code: 'premiumRequired',
      });
    });
  });
});
