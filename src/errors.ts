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
  /** The request exceeded its `timeoutMs` and was aborted client-side. Never sent by the API — the
   * one code this package raises on its own, so a stalled connection is distinguishable from a
   * server that answered. */
  | 'timeout'
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
  /**
   * Seconds to wait before retrying, from the `Retry-After` header. Present on `rateLimited`, and
   * on anything else a proxy in front of the API decides to send it with. Absent otherwise — an
   * error without it is not one that says retrying will help.
   */
  readonly retryAfter: number | undefined;
  /**
   * Credits left in this week's allowance, from `X-Credits-Remaining`. Present on errors from
   * charged routes — notably `creditsExhausted`, where it is `0`. Absent on uncharged routes and on
   * anything a proxy answered instead of the API.
   */
  readonly creditsRemaining: number | undefined;

  constructor(params: {
    statusCode: number;
    statusText: string;
    url: string;
    code: TcgPriserErrorCode;
    message: string;
    details?: unknown;
    body: string;
    retryAfter?: number;
    creditsRemaining?: number;
  }) {
    // `statusCode` is 0 for a client-side timeout, where there was no response to have a status.
    // Printing "tcgpriser: 0 timeout - ..." would read like a bug in the message itself.
    const status = params.statusCode === 0 ? '' : `${params.statusCode} `;
    super(`tcgpriser: ${status}${params.code} - ${params.message} (${params.url})`);
    this.name = 'TcgPriserError';
    this.statusCode = params.statusCode;
    this.statusText = params.statusText;
    this.url = params.url;
    this.code = params.code;
    this.details = params.details;
    this.body = params.body;
    this.retryAfter = params.retryAfter;
    this.creditsRemaining = params.creditsRemaining;
  }
}
