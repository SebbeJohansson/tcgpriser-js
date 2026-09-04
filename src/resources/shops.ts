import type { HttpClient, RequestOptions } from '../http.js';
import { splitRequestOptions, toQueryString } from '../http.js';
import type { Shop } from '../types/index.js';

export interface ListShopsParams extends RequestOptions {
  active?: boolean;
}

export class ShopsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /shops`: every tracked shop. Unwrapped to a plain array, nothing to paginate here. */
  async list(params: ListShopsParams = {}): Promise<Shop[]> {
    const [query, requestOptions] = splitRequestOptions(params);
    const res = await this.http.get<{ data: Shop[] }>(`/shops${toQueryString(query)}`, requestOptions);
    return res.data;
  }

  /** `GET /shops/{id}`: fetch one shop by its id or technicalName. */
  get(idOrTechnicalName: string, options: RequestOptions = {}): Promise<Shop> {
    return this.http.get(`/shops/${encodeURIComponent(idOrTechnicalName)}`, options);
  }
}
