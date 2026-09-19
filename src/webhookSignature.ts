/**
 * Verifying an incoming webhook delivery.
 *
 * Every delivery carries `X-Webhook-Signature: sha256=<hex>`, an HMAC-SHA256 of the **raw** request
 * body keyed with the secret `webhooks.create()` returned once. Checking it is the only thing that
 * distinguishes a real delivery from anyone who guessed your endpoint URL, so an unverified handler
 * is an unauthenticated write endpoint.
 *
 * Built on Web Crypto (`globalThis.crypto.subtle`) rather than node's `crypto`, so the same code
 * runs in a Node server, a Cloudflare Worker, Deno, and Bun — matching the rest of this package,
 * which is isomorphic. Node 18+ exposes Web Crypto globally, which is this package's floor anyway.
 */

import type { WebhookDelivery, WebhookDeliveryEvent, WebhookPayloadMap } from './types/webhook.js';

const SIGNATURE_PREFIX = 'sha256=';

const encoder = new TextEncoder();

function subtle(): SubtleCrypto {
  const webcrypto = (globalThis as { crypto?: Crypto }).crypto;
  if (!webcrypto?.subtle) {
    throw new Error(
      'Web Crypto is unavailable. Node 18+ exposes globalThis.crypto; on older runtimes assign ' +
        "`globalThis.crypto = require('node:crypto').webcrypto` before calling this.",
    );
  }
  return webcrypto.subtle;
}

function toBytes(body: string | Uint8Array | ArrayBuffer): Uint8Array {
  if (typeof body === 'string') return encoder.encode(body);
  if (body instanceof Uint8Array) return body;
  return new Uint8Array(body);
}

/**
 * Constant-time string comparison.
 *
 * `===` on two hex digests returns as soon as they differ, so how long a rejection takes leaks how
 * many leading characters were right — enough, in principle, to recover a valid signature one
 * character at a time. Comparing every character regardless removes that channel. Length is folded
 * into the result rather than short-circuited on, for the same reason.
 */
function timingSafeEqual(a: string, b: string): boolean {
  let mismatch = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i += 1) {
    mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return mismatch === 0;
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export interface SignWebhookPayloadParams {
  /** The exact bytes that were (or will be) sent as the request body. */
  body: string | Uint8Array | ArrayBuffer;
  /** The webhook's signing secret, as returned once by `webhooks.create()`. */
  secret: string;
}

/**
 * Computes the `X-Webhook-Signature` value for a body, including the `sha256=` prefix.
 *
 * Exported mainly so you can generate a realistic signed request in your own tests without
 * reimplementing the scheme. To check an inbound delivery use `verifyWebhookSignature()`, which
 * compares in constant time.
 */
export async function signWebhookPayload(params: SignWebhookPayloadParams): Promise<string> {
  const key = await subtle().importKey(
    'raw',
    encoder.encode(params.secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await subtle().sign('HMAC', key, toBytes(params.body) as BufferSource);
  return `${SIGNATURE_PREFIX}${toHex(signature)}`;
}

export interface VerifyWebhookSignatureParams extends SignWebhookPayloadParams {
  /**
   * The `X-Webhook-Signature` header value, with or without its `sha256=` prefix. A missing header
   * (`undefined`/`null`) verifies as `false` rather than throwing, so an unsigned request takes the
   * same rejection path as a wrongly signed one.
   */
  signature: string | undefined | null;
}

/**
 * Whether `signature` is a valid signature of `body` under `secret`.
 *
 * `body` must be the **raw** bytes as received. Re-serialising a parsed object will not reproduce
 * the signature: key order, whitespace and number formatting all have to match byte for byte. In
 * Express that means `express.raw({ type: 'application/json' })` on this route, not `express.json()`.
 *
 * ```typescript
 * app.post('/hooks/tcgpriser', express.raw({ type: 'application/json' }), async (req, res) => {
 *   const ok = await verifyWebhookSignature({
 *     body: req.body,                                 // a Buffer, i.e. raw bytes
 *     signature: req.header('X-Webhook-Signature'),
 *     secret: process.env.TCGPRISER_WEBHOOK_SECRET!,
 *   });
 *   if (!ok) return res.status(401).end();
 *   res.status(202).end();                            // ack fast, then process
 * });
 * ```
 */
export async function verifyWebhookSignature(
  params: VerifyWebhookSignatureParams,
): Promise<boolean> {
  if (!params.signature) return false;

  const provided = params.signature.startsWith(SIGNATURE_PREFIX)
    ? params.signature.slice(SIGNATURE_PREFIX.length)
    : params.signature;

  const expected = (await signWebhookPayload(params)).slice(SIGNATURE_PREFIX.length);
  return timingSafeEqual(provided.toLowerCase(), expected);
}

export interface ParseWebhookDeliveryParams extends VerifyWebhookSignatureParams {
  /** The `X-Webhook-Event` header value — which event this delivery is for. */
  event: string | undefined | null;
  /** The `X-Webhook-Delivery-Id` header value, if you want it for idempotency bookkeeping. */
  deliveryId?: string | undefined | null;
}

/**
 * Verifies a delivery and returns it as a typed, discriminated `WebhookDelivery`.
 *
 * The one call a handler needs: it checks the signature, parses the body, and tags it with its
 * event so `switch (delivery.event)` narrows `payload` to the right shape.
 *
 * Throws `Error` on a bad signature, an unparseable body, or a missing event header — all three
 * mean "this did not come from us, or did not survive the trip", which a handler should answer
 * with a 4xx rather than try to interpret. The payload itself is **not** validated against its
 * schema: a new optional field must not start failing an old handler.
 *
 * ```typescript
 * const delivery = await parseWebhookDelivery({
 *   body: req.body,
 *   signature: req.header('X-Webhook-Signature'),
 *   event: req.header('X-Webhook-Event'),
 *   deliveryId: req.header('X-Webhook-Delivery-Id'),
 *   secret,
 * });
 *
 * switch (delivery.event) {
 *   case 'price.updated':
 *     for (const change of delivery.payload) await reprice(change.productId);
 *     break;
 *   case 'shop.updated':
 *     await refreshShop(delivery.payload.technicalName);
 *     break;
 * }
 * ```
 */
export async function parseWebhookDelivery(
  params: ParseWebhookDeliveryParams,
): Promise<WebhookDelivery> {
  if (!(await verifyWebhookSignature(params))) {
    throw new Error('Webhook signature verification failed');
  }
  if (!params.event) {
    throw new Error('Webhook delivery is missing its X-Webhook-Event header');
  }

  const raw = typeof params.body === 'string' ? params.body : new TextDecoder().decode(toBytes(params.body));

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error('Webhook delivery body is not valid JSON');
  }

  // The cast is the seam between a string header and the typed union. Narrowing happens for the
  // caller on `delivery.event`; an event name this version of the client does not know about still
  // arrives, carrying its payload as-is, rather than being rejected — the API can add an event
  // without breaking a handler that ignores it.
  return {
    event: params.event as WebhookDeliveryEvent,
    deliveryId: params.deliveryId ?? undefined,
    payload: payload as WebhookPayloadMap[WebhookDeliveryEvent],
  } as WebhookDelivery;
}
