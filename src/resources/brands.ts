import type { HttpClient, RequestOptions } from '../http.js';
import type { Brand } from '../types/index.js';

/** The franchises and makers the catalogue carries — what `brand` filters on `cards.list()`,
 * `products.list()` and `expansions.list()` accept. Read-only: brand rows are rare and deliberate
 * on the API side, so there is no create/update method here. */
export class BrandsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /brands`: every brand. Unwrapped to a plain array, nothing to paginate here — same
   * shape as `expansions.list()`/`shops.list()`. */
  async list(options: RequestOptions = {}): Promise<Brand[]> {
    const res = await this.http.get<{ data: Brand[] }>('/brands', options);
    return res.data;
  }

  /** `GET /brands/{id}`: fetch one brand by its id or technicalName. */
  get(idOrTechnicalName: string, options: RequestOptions = {}): Promise<Brand> {
    return this.http.get(`/brands/${encodeURIComponent(idOrTechnicalName)}`, options);
  }
}
