import { TcgPriserError, type TcgPriserErrorCode } from './errors.js';

export type QueryValue = string | number | boolean | undefined | null;

/**
 * Builds a query string from a params object, dropping `undefined`/`null` entries so callers can
 * pass params straight through without filtering first.
 *
 * Takes a generic `object` instead of `Record<string, QueryValue>` on purpose. The params
 * interfaces (`ListCardsParams` etc.) intentionally have no index signature, otherwise any string
 * key would type-check.
 */
export function toQueryString<T extends object>(params: T): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params) as [string, QueryValue][]) {
    if (value === undefined || value === null) continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

/**
 * Splits the per-call request options off a params object so they don't end up in the query string.
 *
 * `authToken` is the reason this exists: a bearer token has no business in a URL, because query
 * strings end up in server logs, browser history and `Referer` headers. `signal` and `timeoutMs`
 * ride along for the same structural reason — they configure the request rather than describe it,
 * and `String(anAbortSignal)` in a URL would be nonsense.
 */
export function splitRequestOptions<T extends RequestOptions>(
  params: T,
): [Omit<T, keyof RequestOptions>, RequestOptions] {
  const { authToken, signal, timeoutMs, ...rest } = params;
  return [rest, { authToken, signal, timeoutMs }];
}

/** @deprecated Renamed to `splitRequestOptions`, which also splits off `signal`/`timeoutMs`. */
export const splitAuthToken = splitRequestOptions;

const KNOWN_ERROR_CODES: ReadonlySet<string> = new Set([
  'validationFailed',
  'unauthorized',
  'forbidden',
  'notFound',
  'conflict',
  'readOnlyField',
  'rateLimited',
  'premiumRequired',
  'businessRequired',
  'creditsExhausted',
  'internalError',
]);

/** Parses a header that should hold a non-negative integer, ignoring anything that doesn't. */
function readIntHeader(res: Response, name: string): number | undefined {
  const raw = res.headers.get(name);
  if (raw === null) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

async function toApiError(res: Response, url: string): Promise<TcgPriserError> {
  const body = await res.text();
  let code: TcgPriserErrorCode = 'unknown';
  let message = res.statusText || 'Request failed';
  let details: unknown;

  try {
    const parsed = JSON.parse(body) as { error?: { code?: string; message?: string; details?: unknown } };
    if (parsed.error?.code && KNOWN_ERROR_CODES.has(parsed.error.code)) {
      code = parsed.error.code as TcgPriserErrorCode;
    }
    if (parsed.error?.message) message = parsed.error.message;
    details = parsed.error?.details;
  } catch {
    // Not the standard error envelope, maybe a proxy's HTML error page. Fall back to the status
    // text and leave `body` for anyone who wants to dig in.
  }

  return new TcgPriserError({
    statusCode: res.status,
    statusText: res.statusText,
    url,
    code,
    message,
    details,
    body,
    // Both are most useful on exactly the errors that carry them: `retryAfter` on `rateLimited`,
    // `creditsRemaining` on `creditsExhausted` (where it is 0) and on any error from a charged
    // route. Read unconditionally rather than branching on the code, since a proxy can return a
    // 429 with `Retry-After` and no envelope at all.
    retryAfter: readIntHeader(res, 'Retry-After'),
    creditsRemaining: readIntHeader(res, 'X-Credits-Remaining'),
  });
}

export interface HttpClientOptions {
  baseUrl: string;
  fetch: typeof fetch;
  headers?: Record<string, string>;
  /** Default bearer token for premium endpoints, used when a call doesn't pass its own `authToken`. */
  authToken?: string;
  /** Default per-request timeout. See `RequestOptions.timeoutMs`. */
  timeoutMs?: number;
}

/**
 * Per-call overrides, accepted by every method — either standalone or merged into its params object
 * and split back out by `splitRequestOptions`.
 */
export interface RequestOptions {
  /**
   * Overrides the client's default `authToken` for this call. Pass `undefined` explicitly to force
   * an anonymous request even when the client has a default token.
   */
  authToken?: string;
  /**
   * Cancel the request from outside — a user navigating away, a parent operation being abandoned.
   * Composed with `timeoutMs`, so whichever fires first wins; aborting through this signal rejects
   * with the standard `AbortError`, not a `TcgPriserError`.
   */
  signal?: AbortSignal;
  /**
   * Milliseconds before this request is aborted, overriding the client's default. `0` disables the
   * timeout for this call, which is occasionally right for `expansions.cardsLivePricing()` on a very
   * large set. A timeout rejects with a `TcgPriserError` whose `code` is `'timeout'`.
   */
  timeoutMs?: number;
}

/** @deprecated Renamed to `RequestOptions`, which also carries `signal` and `timeoutMs`. */
export type PremiumOptions = RequestOptions;

/**
 * Default request timeout.
 *
 * There was none, which meant a connection that opened and then stalled hung the caller forever
 * with no way out: `fetch` has no built-in timeout, and without a `signal` there is nothing to
 * cancel. A minute is well clear of the slowest thing the API does (a whole-expansion live-pricing
 * recompute) while still being a bound.
 */
export const DEFAULT_TIMEOUT_MS = 60_000;

/**
 * Combines the caller's signal with a timeout into one signal, plus the cleanup that cancels the
 * timer once the request settles.
 *
 * Hand-rolled rather than `AbortSignal.any()` + `AbortSignal.timeout()`: those landed in Node 20,
 * and this package supports Node 18. `clear()` matters as much as the combining — a pending
 * `setTimeout` keeps the Node event loop alive, so a short-lived script that finished its work would
 * otherwise sit there until the last timeout elapsed instead of exiting.
 */
function withTimeout(
  timeoutMs: number,
  callerSignal: AbortSignal | undefined,
): { signal: AbortSignal | undefined; clear: () => void; timedOut: () => boolean } {
  if (timeoutMs <= 0) return { signal: callerSignal, clear: () => {}, timedOut: () => false };

  const controller = new AbortController();
  let expired = false;

  const timer = setTimeout(() => {
    expired = true;
    controller.abort();
  }, timeoutMs);

  const onCallerAbort = (): void => controller.abort();
  if (callerSignal) {
    if (callerSignal.aborted) controller.abort();
    else callerSignal.addEventListener('abort', onCallerAbort, { once: true });
  }

  return {
    signal: controller.signal,
    clear: () => {
      clearTimeout(timer);
      callerSignal?.removeEventListener('abort', onCallerAbort);
    },
    timedOut: () => expired,
  };
}

/** Thin wrapper around `fetch`: joins the base URL, adds default headers, applies the timeout, turns
 * non-2xx responses into a `TcgPriserError`. Every resource method goes through this instead of
 * calling `fetch` directly. */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultAuthToken: string | undefined;
  private readonly defaultTimeoutMs: number;

  /**
   * The `X-Credits-Remaining` value from the most recent charged response, or `undefined` if no
   * charged call has been made yet. See `TcgPriser.creditsRemaining`.
   */
  creditsRemaining: number | undefined;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.fetchImpl = options.fetch;
    this.defaultHeaders = options.headers ?? {};
    this.defaultAuthToken = options.authToken;
    this.defaultTimeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  get<T>(path: string, requestOptions?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, requestOptions);
  }

  post<T>(path: string, body: unknown, requestOptions?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, requestOptions);
  }

  patch<T>(path: string, body: unknown, requestOptions?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, requestOptions);
  }

  delete<T>(path: string, requestOptions?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, requestOptions);
  }

  private async request<T>(
    method: string,
    path: string,
    body: unknown,
    requestOptions?: RequestOptions,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const authToken =
      requestOptions && 'authToken' in requestOptions ? requestOptions.authToken : this.defaultAuthToken;

    const headers: Record<string, string> = { Accept: 'application/json', ...this.defaultHeaders };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const timeoutMs = requestOptions?.timeoutMs ?? this.defaultTimeoutMs;
    const timeout = withTimeout(timeoutMs, requestOptions?.signal);

    let res: Response;
    try {
      res = await this.fetchImpl(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: timeout.signal,
      });
    } catch (error) {
      // Distinguish our own timeout from the caller cancelling. An abort we caused is a failure the
      // caller needs to see as one (and retry, or raise the limit); an abort they caused is them
      // getting what they asked for, so it propagates untouched as the standard `AbortError`.
      if (timeout.timedOut()) {
        throw new TcgPriserError({
          statusCode: 0,
          statusText: 'Timeout',
          url,
          code: 'timeout',
          message: `Request timed out after ${timeoutMs}ms`,
          body: '',
        });
      }
      throw error;
    } finally {
      timeout.clear();
    }

    // Read before the `res.ok` branch: a `creditsExhausted` rejection is exactly when a caller most
    // wants the balance, and it is charged routes that send this header at all.
    const credits = readIntHeader(res, 'X-Credits-Remaining');
    if (credits !== undefined) this.creditsRemaining = credits;

    if (!res.ok) throw await toApiError(res, url);
    if (res.status === 204) return undefined as T;
    return nullsToUndefined(await res.json()) as T;
  }
}

/** JSON has no `undefined`, so every optional field the API omits comes back over the wire as
 * `null`. Recurses through the parsed response and turns those into `undefined` so callers work
 * with idiomatic `foo?.bar` / `foo ?? fallback` instead of `foo !== null`, and so responses match
 * the `T | undefined` types in `generated/openapi.d.ts` (see `scripts/generate-types.mjs`). */
function nullsToUndefined<T>(value: T): T {
  if (value === null) return undefined as T;
  if (Array.isArray(value)) return value.map(nullsToUndefined) as T;
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) result[key] = nullsToUndefined(v);
    return result as T;
  }
  return value;
}
