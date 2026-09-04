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

/** The catalog-wide events a webhook can subscribe to. */
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
