import {
  Product,
  ProductParams,
  ProductFilter,
  ProductRelations
} from './product.interface';

import { apiFetcher } from '@/config/api-fetcher';
import { SharedService } from '@/features/shared/shared.service';
import { PaginationResponse } from '@/interfaces/pagination-response.interface';

export class ProductService extends SharedService {
  static findAllProducts = async (
    options: ProductParams
  ): Promise<PaginationResponse<Product>> => {
    return SharedService.findAll<
      Product,
      ProductFilter,
      ProductRelations,
      ProductParams
    >(apiFetcher, '/products', options);
  };
}
