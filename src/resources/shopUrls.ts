import type { HttpClient, RequestOptions } from '../http.js';
import type { ShopUrlMutationResult } from '../types/index.js';

export interface SubmitShopUrlParams extends RequestOptions {
  url: string;
  /** Shop technicalName. Auto-created if it doesn't exist yet. */
  shop: string;
}

export interface AssignShopUrlProductParams extends RequestOptions {
  /** Product/card id to link, or `null` to unlink and let auto-matching resume. */
  productId: string | null;
}

/** Lets a signed-in subscriber contribute to the catalog: submit a shop URL for scraping, or
 * manually correct which product/card a URL resolves to. Both premium, both mutating. */
export class ShopUrlsResource {
  constructor(private readonly http: HttpClient) {}

  /** `POST /shop-urls/submit`: submit a shop URL for scraping. */
  submit(params: SubmitShopUrlParams): Promise<ShopUrlMutationResult> {
    const { url, shop, ...requestOptions } = params;
    return this.http.post('/shop-urls/submit', { url, shop }, requestOptions);
  }

  /** `PATCH /shop-urls/{id}/product`: manually assign (or clear) the product a shop URL resolves to. */
  assignProduct(
    shopUrlId: string,
    params: AssignShopUrlProductParams,
  ): Promise<ShopUrlMutationResult> {
    const { productId, ...requestOptions } = params;
    return this.http.patch(
      `/shop-urls/${encodeURIComponent(shopUrlId)}/product`,
      { productId },
      requestOptions,
    );
  }
}
