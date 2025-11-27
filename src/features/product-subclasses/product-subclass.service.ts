import type {
  ProductSubclassParams,
  ProductSubclass,
  ProductSubclassFilter,
  ProductSubclassRelations
} from '@/features/product-subclasses/product-subclass.interface';
import type { ProductSubclassDto } from '@/features/product-subclasses/product-subclass.schema';
import type { DataResponse } from '@/interfaces/data-response.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';
import { getErrorMessage } from '@/config/error.mapper';

export class ProductSubclassService extends SharedService {
  static findAllProductSubclasses = async (
    options: ProductSubclassParams
  ): Promise<PaginationResponse<ProductSubclass>> => {
    return SharedService.findAll<
      ProductSubclass,
      ProductSubclassFilter,
      ProductSubclassRelations,
      ProductSubclassParams
    >(apiFetcher, '/product-subclasses', options);
  };

  static findProductSubclassByIdAction = async (
    id: number,
    options: ProductSubclassParams
  ): Promise<ProductSubclass> => {
    return SharedService.findOne<
      ProductSubclass,
      ProductSubclassFilter,
      ProductSubclassRelations,
      ProductSubclassParams
    >(apiFetcher, `/product-subclasses/${id}`, options);
  };

  static createProductSubclass = async (
    productSubclassDto: ProductSubclassDto
  ): Promise<DataResponse<ProductSubclass>> => {
    try {
      const data = await SharedService.create<
        DataResponse<ProductSubclass>,
        ProductSubclassDto
      >(apiFetcher, '/product-subclasses', productSubclassDto);

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static updateProductSubclass = async (
    id: number,
    productSubclassDto: ProductSubclassDto
  ): Promise<DataResponse<ProductSubclass>> => {
    try {
      const data = await SharedService.update<
        DataResponse<ProductSubclass>,
        ProductSubclassDto
      >(apiFetcher, `/product-subclasses/${id}`, productSubclassDto);

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };
}
