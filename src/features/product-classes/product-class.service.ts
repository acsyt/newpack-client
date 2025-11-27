import type {
  ProductClassParams,
  ProductClass,
  ProductClassFilter,
  ProductClassRelations
} from '@/features/product-classes/product-class.interface';
import type { ProductClassDto } from '@/features/product-classes/product-class.schema';
import type { DataResponse } from '@/interfaces/data-response.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';
import { getErrorMessage } from '@/config/error.mapper';

export class ProductClassService extends SharedService {
  static findAllProductClasses = async (
    options: ProductClassParams
  ): Promise<PaginationResponse<ProductClass>> => {
    return SharedService.findAll<
      ProductClass,
      ProductClassFilter,
      ProductClassRelations,
      ProductClassParams
    >(apiFetcher, '/product-classes', options);
  };

  static findProductClassByIdAction = async (
    id: number,
    options: ProductClassParams
  ): Promise<ProductClass> => {
    return SharedService.findOne<
      ProductClass,
      ProductClassFilter,
      ProductClassRelations,
      ProductClassParams
    >(apiFetcher, `/product-classes/${id}`, options);
  };

  static createProductClass = async (
    productClassDto: ProductClassDto
  ): Promise<DataResponse<ProductClass>> => {
    try {
      const data = await SharedService.create<
        DataResponse<ProductClass>,
        ProductClassDto
      >(apiFetcher, '/product-classes', productClassDto);

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static updateProductClass = async (
    id: number,
    productClassDto: ProductClassDto
  ): Promise<DataResponse<ProductClass>> => {
    try {
      const data = await SharedService.update<
        DataResponse<ProductClass>,
        ProductClassDto
      >(apiFetcher, `/product-classes/${id}`, productClassDto);

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };
}
