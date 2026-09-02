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
  | 'businessRequired'
  | 'creditsExhausted'
  | 'internalError'
  /** Response body wasn't the `{ error: { code, message } }` shape. Probably a proxy or gateway
   * error in front of the API. */
  | 'unknown';

/** Thrown for any non-2xx response. Carries the parsed `{ code, message }` when the body matched
 * the API's error envelope, plus the raw status/body regardless so nothing gets lost. */
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
    super(`tcgpriser: ${params.statusCode} ${params.code} - ${params.message} (${params.url})`);
    this.name = 'TcgPriserError';
    this.statusCode = params.statusCode;
    this.statusText = params.statusText;
    this.url = params.url;
    this.code = params.code;
    this.details = params.details;
    this.body = params.body;
  }
}
