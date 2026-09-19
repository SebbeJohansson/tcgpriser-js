/**
 * Types for the Business tier: outbound webhooks, the one feature that distinguishes Business from
 * Premium. Everything here needs a Business subscriber's API token — a Premium token answers
 * `403 businessRequired`.
 *
 * Derived from `src/generated/openapi.d.ts`, same as everything else in this directory.
 */
import type { components } from '../generated/openapi.js';

/** One registered webhook, as returned by `client.webhooks.list()`. Never carries the signing
 * secret — see `WebhookWithSecret`, which is returned exactly once at registration. */
export type Webhook = components['schemas']['Webhook'];

/**
 * The catalog-wide events a webhook can subscribe to.
 *
 * Delivery payloads are not uniform: the catalog lifecycle events (`*.created`, `*.updated`,
 * `*.deleted`) carry a change descriptor, while `price.updated`, `bargain.found`,
 * `product.created` and `card.created` predate that shape and keep their own. The API does not
 * model delivery bodies in its OpenAPI spec, so there is nothing to derive a payload type from
 * here — see the Webhooks section of README.md for each shape.
 */
export type WebhookEvent = components['schemas']['WebhookEvent'];

/** Whether the most recent delivery attempt succeeded. `undefined` until the first attempt. */
export type WebhookDeliveryStatus = NonNullable<Webhook['lastDeliveryStatus']>;

/**
 * What `client.webhooks.create()` returns: a `Webhook` plus the `secret` used to sign deliveries.
 *
 * The secret is returned by that one call and never again — there is no endpoint that reads it
 * back, by design. Store it when you create the webhook; if you lose it, delete the webhook and
 * register a new one.
 */
export type WebhookWithSecret = components['schemas']['WebhookSecret'];

/** Response of `client.webhooks.test()`. */
export type WebhookTestResult = components['schemas']['WebhookTestResult'];

/** Response of `client.webhooks.delete()`. */
export type Acknowledgement = components['schemas']['Acknowledgement'];

/* -------------------------------------------------------------------------------------------- *
 * Delivery payloads — the bodies the API POSTs to your endpoint.
 *
 * These are generated like everything else here: the API declares each one as an OpenAPI
 * `callbacks` entry on `POST /webhooks`, so the shapes below come from the same spec the rest of
 * the client does and cannot drift from what is actually sent.
 * -------------------------------------------------------------------------------------------- */

/**
 * The body of every catalog lifecycle event: `product.created`/`updated`, `card.created`/`updated`,
 * `expansion.created`/`updated`, `shop.created`/`updated`/`deleted`.
 *
 * `technicalName`, `brand` and `expansion` are slugs rather than ids — together with `entity` they
 * are the URL segments of the page the object occupies on tcgpriser.se, which is what you need to
 * know what to re-fetch. Each is absent rather than null where it does not apply: shops have no
 * brand, and only products and cards have an expansion.
 */
export type WebhookCatalogChange = components['schemas']['WebhookCatalogChange'];

/** Which kind of object a `WebhookCatalogChange` describes. */
export type WebhookChangeEntity = WebhookCatalogChange['entity'];

/** What happened to it. */
export type WebhookChangeAction = WebhookCatalogChange['action'];

/** The body of `product.created`. Predates `WebhookCatalogChange` and is kept as-is. */
export type WebhookProductCreated = components['schemas']['WebhookProductCreated'];

/** The body of `card.created`. Predates `WebhookCatalogChange` and is kept as-is. */
export type WebhookCardCreated = components['schemas']['WebhookCardCreated'];

/**
 * One entry in a `price.updated` delivery, which carries an array of these.
 *
 * `productId` names a card as often as a sealed product — one pricing run writes both and the
 * field predates the split. Either resolves through `cards.get()` or `products.get()`.
 */
export type WebhookPriceChange = components['schemas']['WebhookPriceChange'];

/** One entry in a `bargain.found` delivery, which carries an array of these. */
export type WebhookBargain = components['schemas']['WebhookBargain'];

/** The body of the sample delivery `webhooks.test()` sends, under the event name `test`. */
export type WebhookTestPayload = components['schemas']['WebhookTestPayload'];

/**
 * Every event name that can arrive in the `X-Webhook-Event` header.
 *
 * Wider than `WebhookEvent`: `test` is deliverable but not subscribable, since it is triggered by
 * `webhooks.test()` rather than by anything in the catalog.
 */
export type WebhookDeliveryEvent = WebhookEvent | 'test';

/**
 * What each event delivers.
 *
 * Payloads are not uniform. Most events carry a `WebhookCatalogChange`; the four that predate that
 * shape keep the bodies their subscribers already parse, and two of those are arrays because a
 * single pricing or ingest run can move thousands of items and is delivered as one batch.
 */
export interface WebhookPayloadMap {
  'price.updated': WebhookPriceChange[];
  'bargain.found': WebhookBargain[];
  'product.created': WebhookProductCreated;
  'card.created': WebhookCardCreated;
  'product.updated': WebhookCatalogChange;
  'card.updated': WebhookCatalogChange;
  'expansion.created': WebhookCatalogChange;
  'expansion.updated': WebhookCatalogChange;
  'shop.created': WebhookCatalogChange;
  'shop.updated': WebhookCatalogChange;
  'shop.deleted': WebhookCatalogChange;
  test: WebhookTestPayload;
}

/** The payload for one event name, e.g. `WebhookPayload<'shop.updated'>`. */
export type WebhookPayload<E extends WebhookDeliveryEvent = WebhookDeliveryEvent> =
  WebhookPayloadMap[E];

/**
 * A verified delivery, discriminated on `event` — `switch (delivery.event)` narrows `payload` to
 * the right shape in each branch. Returned by `parseWebhookDelivery()`.
 */
export type WebhookDelivery = {
  [E in WebhookDeliveryEvent]: { event: E; deliveryId: string | undefined; payload: WebhookPayloadMap[E] };
}[WebhookDeliveryEvent];
