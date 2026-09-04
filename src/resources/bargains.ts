import type { HttpClient, RequestOptions } from '../http.js';
import { splitRequestOptions, toQueryString } from '../http.js';
import type {
  Bargain,
  BargainReferenceSource,
  CardType,
  GradingCompany,
  ItemCondition,
  ListResponse,
  PaginationParams,
} from '../types/index.js';

export interface ListBargainsParams extends RequestOptions {
  type?: 'sealed' | 'card' | 'all';
}

export interface SearchBargainsParams extends PaginationParams {
  type?: 'sealed' | 'card' | 'all';
  /** Filter by shop technicalName. */
  shop?: string;
  /** Filter by which reference price source qualified the bargain. */
  referenceSource?: BargainReferenceSource;
  /** Minimum discount percentage. Default 10. */
  minDiscount?: number;
  /** Default `true`. */
  inStock?: boolean;
  cardType?: CardType;
  itemCondition?: ItemCondition;
  gradingCompany?: GradingCompany;
  grade?: number;
  /** Free-text search on product name / technicalName. */
  search?: string;
}

export class BargainsResource {
  constructor(private readonly http: HttpClient) {}

  /** `GET /bargains`: current shop listings priced notably below their reference price. Result
   * count is fixed by the API (no `limit`/`skip` on the public tier); `pagination.hasMore` tells
   * you if more exist. */
  list(params: ListBargainsParams = {}): Promise<ListResponse<Bargain>> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(`/bargains${toQueryString(query)}`, requestOptions);
  }

  /** `GET /bargains/search`: like `list()`, but with real pagination and filters (shop, discount
   * threshold, card condition/grade, free-text search). Premium. */
  search(params: SearchBargainsParams = {}): Promise<ListResponse<Bargain>> {
    const [query, requestOptions] = splitRequestOptions(params);
    return this.http.get(`/bargains/search${toQueryString(query)}`, requestOptions);
  }
}
