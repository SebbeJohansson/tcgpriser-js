import type { HttpClient, RequestOptions } from '../http.js';
import type { PackRate } from '../types/index.js';

export class PackRatesResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /pack-rates`: pull-rate odds for every expansion that has them. Unwrapped to a plain
   * array, nothing to paginate here. */
  async list(options: RequestOptions = {}): Promise<PackRate[]> {
    const res = await this.http.get<{ data: PackRate[] }>('/pack-rates', options);
    return res.data;
  }

  /** `GET /pack-rates/{expansionId}`: pull-rate odds for one expansion. */
  get(expansionId: string, options: RequestOptions = {}): Promise<PackRate> {
    return this.http.get(`/pack-rates/${encodeURIComponent(expansionId)}`, options);
  }
}
