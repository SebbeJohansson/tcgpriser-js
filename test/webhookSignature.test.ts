import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  parseWebhookDelivery,
  signWebhookPayload,
  verifyWebhookSignature,
} from '../src/webhookSignature.js';

const SECRET = 'a'.repeat(64);

/**
 * The API's own signing, transcribed from `signPayload` in its webhookDelivery.service.ts:
 * `crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex')`, sent as
 * `sha256=<hex>`. Written out here with node's crypto rather than reusing our Web Crypto
 * implementation, so these tests compare two independent implementations instead of confirming
 * that ours agrees with itself.
 */
function apiSignature(body: string, secret = SECRET): string {
  return `sha256=${createHmac('sha256', secret).update(body, 'utf8').digest('hex')}`;
}

describe('signWebhookPayload', () => {
  it('reproduces the signature the API sends', async () => {
    const body = JSON.stringify({ entity: 'shop', action: 'updated' });
    expect(await signWebhookPayload({ body, secret: SECRET })).toBe(apiSignature(body));
  });

  it('signs raw bytes identically to the equivalent string', async () => {
    const body = '{"a":1}';
    const fromBytes = await signWebhookPayload({
      body: new TextEncoder().encode(body),
      secret: SECRET,
    });
    expect(fromBytes).toBe(apiSignature(body));
  });

  it('signs non-ASCII bodies as UTF-8, matching the API', async () => {
    // A Swedish shop name in a payload is routine; getting the encoding wrong would pass every
    // ASCII test and fail in production.
    const body = JSON.stringify({ technicalName: 'dragons-lair', name: 'Sci-Fi Bokhandeln Göteborg' });
    expect(await signWebhookPayload({ body, secret: SECRET })).toBe(apiSignature(body));
  });
});

describe('verifyWebhookSignature', () => {
  it('accepts a correctly signed body', async () => {
    const body = '{"event":"real"}';
    expect(
      await verifyWebhookSignature({ body, signature: apiSignature(body), secret: SECRET }),
    ).toBe(true);
  });

  it('accepts a signature given without the sha256= prefix', async () => {
    const body = '{"event":"real"}';
    const bare = apiSignature(body).replace('sha256=', '');
    expect(await verifyWebhookSignature({ body, signature: bare, secret: SECRET })).toBe(true);
  });

  it('rejects a body that changed after signing', async () => {
    const signature = apiSignature('{"amount":1}');
    expect(
      await verifyWebhookSignature({ body: '{"amount":9999}', signature, secret: SECRET }),
    ).toBe(false);
  });

  it('rejects a signature made with a different secret', async () => {
    const body = '{"event":"real"}';
    expect(
      await verifyWebhookSignature({
        body,
        signature: apiSignature(body, 'b'.repeat(64)),
        secret: SECRET,
      }),
    ).toBe(false);
  });

  it('rejects a missing header rather than throwing', async () => {
    expect(await verifyWebhookSignature({ body: '{}', signature: undefined, secret: SECRET })).toBe(
      false,
    );
    expect(await verifyWebhookSignature({ body: '{}', signature: '', secret: SECRET })).toBe(false);
  });

  it('rejects a truncated signature instead of matching on its prefix', async () => {
    const body = '{"event":"real"}';
    const truncated = apiSignature(body).slice(0, 20);
    expect(await verifyWebhookSignature({ body, signature: truncated, secret: SECRET })).toBe(false);
  });
});

describe('parseWebhookDelivery', () => {
  it('returns the payload tagged with its event', async () => {
    const payload = {
      entity: 'shop',
      action: 'updated',
      id: '6a577711abc1ce71383d3e10',
      technicalName: 'dragons-lair',
      occurredAt: '2026-09-19T00:00:00.000Z',
    };
    const body = JSON.stringify(payload);

    const delivery = await parseWebhookDelivery({
      body,
      signature: apiSignature(body),
      event: 'shop.updated',
      deliveryId: 'abc123',
      secret: SECRET,
    });

    expect(delivery.event).toBe('shop.updated');
    expect(delivery.deliveryId).toBe('abc123');
    expect(delivery.payload).toEqual(payload);
  });

  it('parses a batched array payload', async () => {
    const body = JSON.stringify([{ productId: '6a577711abc1ce71383d3e10', discountPercent: 30 }]);

    const delivery = await parseWebhookDelivery({
      body,
      signature: apiSignature(body),
      event: 'bargain.found',
      secret: SECRET,
    });

    expect(Array.isArray(delivery.payload)).toBe(true);
  });

  it('passes through an event name this client version does not know', async () => {
    // Forward compatibility: the API must be able to add an event without breaking a handler that
    // simply ignores it.
    const body = '{"anything":true}';

    const delivery = await parseWebhookDelivery({
      body,
      signature: apiSignature(body),
      event: 'something.new',
      secret: SECRET,
    });

    expect(delivery.event).toBe('something.new');
  });

  it('throws on a bad signature', async () => {
    await expect(
      parseWebhookDelivery({
        body: '{}',
        signature: apiSignature('{"different":true}'),
        event: 'shop.updated',
        secret: SECRET,
      }),
    ).rejects.toThrow(/signature verification failed/i);
  });

  it('throws on a missing event header', async () => {
    const body = '{}';
    await expect(
      parseWebhookDelivery({ body, signature: apiSignature(body), event: null, secret: SECRET }),
    ).rejects.toThrow(/X-Webhook-Event/);
  });

  it('throws on a body that is not JSON', async () => {
    const body = 'not json';
    await expect(
      parseWebhookDelivery({
        body,
        signature: apiSignature(body),
        event: 'shop.updated',
        secret: SECRET,
      }),
    ).rejects.toThrow(/not valid JSON/);
  });
});
