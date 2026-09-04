import type { HttpClient, RequestOptions } from '../http.js';
import type { PlatformStats } from '../types/index.js';

export class StatsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /stats`: platform-wide overview counts (shops, expansions, products, prices tracked). */
  platform(options: RequestOptions = {}): Promise<PlatformStats> {
    return this.http.get('/stats', options);
  }
}
