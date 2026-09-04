import type { HttpClient, RequestOptions } from '../http.js';
import type {
  Acknowledgement,
  ListResponse,
  Webhook,
  WebhookEvent,
  WebhookTestResult,
  WebhookWithSecret,
} from '../types/index.js';

export interface CreateWebhookParams extends RequestOptions {
  /**
   * Where deliveries are POSTed. Must be `https://` — the API rejects plaintext, since a delivery
   * carries the signature that authenticates it.
   */
  url: string;
  /** At least one event to subscribe to. */
  events: WebhookEvent[];
}

/**
 * Outbound webhooks: the API calls you when something changes, instead of you polling for it.
 *
 * Business tier, not Premium — a Premium token answers `403 businessRequired`. The feature is also
 * behind a server-side flag, and when that flag is off these answer `404 notFound` rather than 403,
 * so a `notFound` here means "not enabled on this instance", not "wrong id".
 */
export class WebhooksResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * `POST /webhooks`: register a new webhook.
   *
   * The returned `secret` is the only copy you will ever get — sign-verification depends on it and
   * no endpoint reads it back. Persist it here, at creation, or delete the webhook and make a new
   * one.
   */
  create(params: CreateWebhookParams): Promise<WebhookWithSecret> {
    const { url, events, ...requestOptions } = params;
    return this.http.post('/webhooks', { url, events }, requestOptions);
  }

  /** `GET /webhooks`: every webhook registered on this account. Secrets are never included. */
  list(options: RequestOptions = {}): Promise<ListResponse<Webhook>> {
    return this.http.get('/webhooks', options);
  }

  /** `DELETE /webhooks/{id}`: revoke a webhook. Deliveries stop immediately; its secret is void. */
  delete(webhookId: string, options: RequestOptions = {}): Promise<Acknowledgement> {
    return this.http.delete(`/webhooks/${encodeURIComponent(webhookId)}`, options);
  }

  /** `POST /webhooks/{id}/test`: send a sample delivery to the registered URL, so you can verify
   * your endpoint and your signature check before waiting on a real event. */
  test(webhookId: string, options: RequestOptions = {}): Promise<WebhookTestResult> {
    return this.http.post(`/webhooks/${encodeURIComponent(webhookId)}/test`, undefined, options);
  }
}
