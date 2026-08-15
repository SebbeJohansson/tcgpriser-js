/** The stable error codes the API's `error.code` field can hold. */
export type TcgPriserErrorCode =
  | 'validationFailed'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'conflict'
  | 'readOnlyField'
  | 'rateLimited'
  | 'premiumRequired'
  | 'internalError'
  /** The response body wasn't the `{ error: { code, message } }` shape — a proxy or gateway error
   * in front of the API, most likely. */
  | 'unknown';

/**
 * Thrown for any non-2xx response. Carries the parsed `{ code, message }` from the API's error
 * envelope when the body matched it, and the raw status/body regardless so nothing is lost if it
 * didn't.
 */
export class TcgPriserError extends Error {
  readonly statusCode: number;
  readonly statusText: string;
  readonly url: string;
  readonly code: TcgPriserErrorCode;
  readonly details: unknown;
  /** The raw response body, for debugging when `code`/`details` don't cover what you need. */
  readonly body: string;

  constructor(params: {
    statusCode: number;
    statusText: string;
    url: string;
    code: TcgPriserErrorCode;
    message: string;
    details?: unknown;
    body: string;
  }) {
    super(`tcgpriser: ${params.statusCode} ${params.code} — ${params.message} (${params.url})`);
    this.name = 'TcgPriserError';
    this.statusCode = params.statusCode;
    this.statusText = params.statusText;
    this.url = params.url;
    this.code = params.code;
    this.details = params.details;
    this.body = params.body;
  }
}
