import { TcgPriserError, type TcgPriserErrorCode } from './errors.js';

export type QueryValue = string | number | boolean | undefined | null;

/** Builds a query string, silently dropping `undefined`/`null` entries so callers can pass a params
 * object straight through without filtering it themselves first.
 *
 * Typed as a generic `object` rather than `Record<string, QueryValue>` deliberately: the resource
 * params interfaces (e.g. `ListCardsParams`) have no index signature, since an index signature would
 * let any string key through unchecked — the opposite of what a hand-written params type is for. */
export function toQueryString<T extends object>(params: T): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params) as [string, QueryValue][]) {
    if (value === undefined || value === null) continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

/** Splits `authToken` off a premium-endpoint params object so it can go on the `Authorization`
 * header instead of into `toQueryString` — a bearer token belongs in a header, never in a URL
 * (query strings end up in server logs, browser history, and `Referer` headers). */
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
    // Body wasn't the standard error envelope (e.g. a proxy's HTML error page) — fall back to the
    // raw status text and leave `body` for whoever wants to inspect it.
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

/** Per-request auth override for a premium endpoint, layered on top of the client's default
 * `authToken`. Every premium resource method takes one of these, either standalone (methods with no
 * other params) or merged into that method's params object (see `splitAuthToken`). */
export interface PremiumOptions {
  /** Overrides the client's default `authToken` for this one call. Pass an explicit `undefined` to
   * force an anonymous request even when the client has a default token. */
  authToken?: string;
}

/** Thin wrapper around `fetch`: joins the base URL, attaches default headers, and turns non-2xx
 * responses into a `TcgPriserError` instead of a plain `Error`. Every resource method funnels
 * through this rather than calling `fetch` itself. */
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
    return (await res.json()) as T;
  }
}
