import { SharedService } from '../shared/shared.service';

import { ProductType, ProductTypeParams } from './product-type.interface';

import { apiFetcher } from '@/config/api-fetcher';
import { PaginationResponse } from '@/interfaces/pagination-response.interface';

export class ProductTypeService extends SharedService {
  static async findAllProductTypes(
    options: ProductTypeParams
  ): Promise<PaginationResponse<ProductType>> {
    return SharedService.findAll<ProductType, any, any, ProductTypeParams>(
      apiFetcher,
      '/product-types',
      options
    );
  }
}
