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

    await client.cards.search({ search: 'pikachu', limit: 5 });

    expect(capturedUrl).toBe('http://localhost:5000/cards/search?search=pikachu&limit=5');
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

  it('converts null to undefined, recursively, in response bodies', async () => {
    const client = new TcgPriser({
      advanced: {
        fetch: fakeFetch(() =>
          jsonResponse({
            id: '1',
            name: 'x',
            technicalName: 'x',
            imageUrl: null,
            pricing: { retailPrice: null, nested: [{ note: null, value: 1 }] },
          }),
        ),
      },
    });

    const card = await client.cards.livePricing('some-card');

    expect(card).toEqual({
      id: '1',
      name: 'x',
      technicalName: 'x',
      imageUrl: undefined,
      pricing: { retailPrice: undefined, nested: [{ note: undefined, value: 1 }] },
    });
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

    it('calls the default global fetch bound to its receiver, not detached', async () => {
      // Real browser/undici fetch is a brand-checked method: calling an extracted reference with
      // the wrong `this` throws "Illegal invocation" (browsers) or the undici equivalent, which
      // mimics that exact message even under Node/SSR. Simulates that here instead of using
      // fakeFetch(), which is a plain arrow function and wouldn't catch a regression of this bug.
      const originalFetch = globalThis.fetch;
      function brandCheckedFetch(this: unknown) {
        if (this !== globalThis) {
          throw new TypeError("Failed to execute 'fetch' on 'Window': Illegal invocation");
        }
        return Promise.resolve(jsonResponse({}));
      }
      globalThis.fetch = brandCheckedFetch as typeof fetch;

      try {
        const client = new TcgPriser();
        await expect(client.stats.platform()).resolves.toEqual({});
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });

  describe('timeouts and cancellation', () => {
    it('rejects with code "timeout" when the request outlives timeoutMs', async () => {
      const client = new TcgPriser({
        advanced: {
          // Never settles on its own, so the only thing that can end this call is the timeout.
          fetch: ((_input: unknown, init?: RequestInit) =>
            new Promise((_resolve, reject) => {
              init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
            })) as typeof fetch,
        },
      });

      await expect(client.stats.platform({ timeoutMs: 20 })).rejects.toMatchObject({
        code: 'timeout',
        statusCode: 0,
      });
    });

    it('leaves the status out of a timeout message, since there was no response', async () => {
      const client = new TcgPriser({
        advanced: {
          fetch: ((_input: unknown, init?: RequestInit) =>
            new Promise((_resolve, reject) => {
              init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
            })) as typeof fetch,
        },
      });

      const error = await client.stats.platform({ timeoutMs: 20 }).catch((e: unknown) => e);
      expect((error as TcgPriserError).message).toContain('tcgpriser: timeout');
      expect((error as TcgPriserError).message).not.toContain(' 0 ');
    });

    it('passes a caller AbortSignal through, and reports that abort as the caller\'s, not a timeout', async () => {
      const controller = new AbortController();
      const client = new TcgPriser({
        advanced: {
          fetch: ((_input: unknown, init?: RequestInit) =>
            new Promise((_resolve, reject) => {
              init?.signal?.addEventListener('abort', () => reject(new Error('caller aborted')));
            })) as typeof fetch,
        },
      });

      const pending = client.stats.platform({ signal: controller.signal });
      controller.abort();

      // Not a TcgPriserError: the caller got exactly what they asked for, so the abort propagates
      // untouched rather than being dressed up as a failure of ours.
      await expect(pending).rejects.not.toBeInstanceOf(TcgPriserError);
    });

    it('does not time out a call that completes in time', async () => {
      const client = new TcgPriser({
        advanced: { fetch: fakeFetch(() => jsonResponse({ productCount: 1 })) },
      });

      await expect(client.stats.platform({ timeoutMs: 5000 })).resolves.toEqual({ productCount: 1 });
    });

    it('timeoutMs: 0 disables the timeout for that call', async () => {
      let sawSignal: AbortSignal | null | undefined;
      const client = new TcgPriser({
        advanced: {
          fetch: ((_input: unknown, init?: RequestInit) => {
            sawSignal = init?.signal;
            return Promise.resolve(jsonResponse({}));
          }) as typeof fetch,
        },
      });

      await client.stats.platform({ timeoutMs: 0 });

      // No timer, and no caller signal either, so there is nothing to pass along.
      expect(sawSignal ?? undefined).toBeUndefined();
    });
  });

  describe('credits', () => {
    it('tracks X-Credits-Remaining off the last charged response', async () => {
      const client = new TcgPriser({
        authToken: 'token',
        advanced: {
          fetch: fakeFetch(
            () =>
              new Response(JSON.stringify({ id: '1', name: 'x', technicalName: 'x', pricing: {} }), {
                status: 200,
                headers: { 'Content-Type': 'application/json', 'X-Credits-Remaining': '1487' },
              }),
          ),
        },
      });

      expect(client.creditsRemaining).toBeUndefined();
      await client.cards.livePricing('some-card');
      expect(client.creditsRemaining).toBe(1487);
    });

    it('leaves the last known balance alone when a response carries no credit header', async () => {
      let withHeader = true;
      const client = new TcgPriser({
        authToken: 'token',
        advanced: {
          fetch: fakeFetch(() => {
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (withHeader) headers['X-Credits-Remaining'] = '42';
            withHeader = false;
            return new Response(JSON.stringify({}), { status: 200, headers });
          }),
        },
      });

      await client.cards.livePricing('some-card');
      expect(client.creditsRemaining).toBe(42);

      // An uncharged (public) call must not reset the balance to undefined.
      await client.stats.platform();
      expect(client.creditsRemaining).toBe(42);
    });

    it('exposes the balance on a creditsExhausted error, where it is 0', async () => {
      const client = new TcgPriser({
        authToken: 'token',
        advanced: {
          fetch: fakeFetch(
            () =>
              new Response(
                JSON.stringify({ error: { code: 'creditsExhausted', message: 'Out of credits' } }),
                {
                  status: 429,
                  headers: { 'Content-Type': 'application/json', 'X-Credits-Remaining': '0' },
                },
              ),
          ),
        },
      });

      const error = await client.cards.livePricing('some-card').catch((e: unknown) => e);
      expect((error as TcgPriserError).code).toBe('creditsExhausted');
      expect((error as TcgPriserError).creditsRemaining).toBe(0);
    });
  });

  describe('rate limiting', () => {
    it('surfaces rateLimited with the Retry-After the API sends', async () => {
      const client = new TcgPriser({
        advanced: {
          fetch: fakeFetch(
            () =>
              new Response(
                JSON.stringify({
                  error: {
                    code: 'rateLimited',
                    message: 'Too many requests. Please slow down.',
                    details: { limit: 300, resetsAt: '2026-09-04T12:00:00.000Z' },
                  },
                }),
                {
                  status: 429,
                  headers: { 'Content-Type': 'application/json', 'Retry-After': '37' },
                },
              ),
          ),
        },
      });

      const error = await client.cards.list().catch((e: unknown) => e);
      expect((error as TcgPriserError).code).toBe('rateLimited');
      expect((error as TcgPriserError).retryAfter).toBe(37);
    });

    it('leaves retryAfter undefined on errors that do not carry the header', async () => {
      const client = new TcgPriser({
        advanced: {
          fetch: fakeFetch(() =>
            jsonResponse({ error: { code: 'notFound', message: 'nope' } }, 404),
          ),
        },
      });

      const error = await client.cards.get('nope').catch((e: unknown) => e);
      expect((error as TcgPriserError).retryAfter).toBeUndefined();
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
