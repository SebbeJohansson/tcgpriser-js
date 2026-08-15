import type { HttpClient } from '../http.js';
import { toQueryString } from '../http.js';
import type { Shop } from '../types/index.js';

export interface ListShopsParams {
  active?: boolean;
}

export class ShopsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /shops`: every tracked shop. Unwrapped to a plain array, nothing to paginate here. */
  async list(params: ListShopsParams = {}): Promise<Shop[]> {
    const res = await this.http.get<{ data: Shop[] }>(`/shops${toQueryString(params)}`);
    return res.data;
  }

  /** `GET /shops/{id}`: fetch one shop by its id or technicalName. */
  get(idOrTechnicalName: string): Promise<Shop> {
    return this.http.get(`/shops/${encodeURIComponent(idOrTechnicalName)}`);
  }
}
