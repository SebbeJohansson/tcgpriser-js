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

/** Splits `authToken` off a params object so it goes on the `Authorization` header, not through
 * `toQueryString`. A bearer token has no business in a URL: query strings end up in server logs,
 * browser history, `Referer` headers. */
export function splitAuthToken<T extends { authToken?: string }>(
  params: T,
): [Omit<T, 'authToken'>, string | undefined] {
  const { authToken, ...rest } = params;
  return [rest, authToken];
}

const KNOWN_ERROR_CODES: ReadonlySet<string> = new Set([
  'validationFailed',
  'unauthorized',
  'forbidden',
  'notFound',
  'conflict',
  'readOnlyField',
  'rateLimited',
  'premiumRequired',
  'internalError',
]);

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

  return new TcgPriserError({ statusCode: res.status, statusText: res.statusText, url, code, message, details, body });
}

export interface HttpClientOptions {
  baseUrl: string;
  fetch: typeof fetch;
  headers?: Record<string, string>;
  /** Default bearer token for premium endpoints, used when a call doesn't pass its own `authToken`. */
  authToken?: string;
}

/** Per-call auth override for a premium endpoint, on top of the client's default `authToken`.
 * Every premium method takes one of these, either standalone or merged into its params object via
 * `splitAuthToken`. */
export interface PremiumOptions {
  /** Overrides the client's default `authToken` for this call. Pass `undefined` explicitly to
   * force an anonymous request even when the client has a default token. */
  authToken?: string;
}

/** Thin wrapper around `fetch`: joins the base URL, adds default headers, turns non-2xx responses
 * into a `TcgPriserError`. Every resource method goes through this instead of calling `fetch`
 * directly. */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultAuthToken: string | undefined;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.fetchImpl = options.fetch;
    this.defaultHeaders = options.headers ?? {};
    this.defaultAuthToken = options.authToken;
  }

  get<T>(path: string, requestOptions?: PremiumOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, requestOptions);
  }

  post<T>(path: string, body: unknown, requestOptions?: PremiumOptions): Promise<T> {
    return this.request<T>('POST', path, body, requestOptions);
  }

  patch<T>(path: string, body: unknown, requestOptions?: PremiumOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, requestOptions);
  }

  private async request<T>(
    method: string,
    path: string,
    body: unknown,
    requestOptions?: PremiumOptions,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const authToken = requestOptions && 'authToken' in requestOptions ? requestOptions.authToken : this.defaultAuthToken;

    const headers: Record<string, string> = { Accept: 'application/json', ...this.defaultHeaders };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const res = await this.fetchImpl(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

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
