import {
  Product,
  ProductParams,
  ProductFilter,
  ProductRelations
} from './product.interface';
import { ProductDto } from './product.schema';

import { apiFetcher } from '@/config/api-fetcher';
import { SharedService } from '@/features/shared/shared.service';
import { DataResponse } from '@/interfaces/data-response.interface';
import { MeasureUnit } from '@/interfaces/measure-unit.interface';
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

  static createProduct = async (
    data: ProductDto
  ): Promise<DataResponse<Product>> => {
    return SharedService.create<DataResponse<Product>, ProductDto>(
      apiFetcher,
      '/products',
      data
    );
  };

  static updateProduct = async (
    id: number,
    data: ProductDto
  ): Promise<DataResponse<Product>> => {
    return SharedService.update<DataResponse<Product>, ProductDto>(
      apiFetcher,
      `/products/${id}`,
      data
    );
  };

  static getAllMeasureUnits = async (): Promise<
    DataResponse<MeasureUnit[]>
  > => {
    const response =
      await apiFetcher.get<DataResponse<MeasureUnit[]>>('/measure-units');

    return response.data;
  };
}
