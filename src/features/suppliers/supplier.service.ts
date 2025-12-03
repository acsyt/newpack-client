import type {
  Supplier,
  SupplierFilter,
  SupplierRelations,
  SupplierParams
} from '@/features/suppliers/supplier.interface';
import type { SupplierDto } from '@/features/suppliers/supplier.schema';
import type { DataResponse } from '@/interfaces/data-response.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';
import { getErrorMessage } from '@/config/error.mapper';

export class SupplierService extends SharedService {
  static findAllSuppliers = async (
    options: SupplierParams
  ): Promise<PaginationResponse<Supplier>> => {
    return SharedService.findAll<
      Supplier,
      SupplierFilter,
      SupplierRelations,
      SupplierParams
    >(apiFetcher, '/suppliers', options);
  };

  static findSupplierByIdAction = async (
    id: number,
    options: SupplierParams
  ): Promise<Supplier> => {
    return SharedService.findOne<
      Supplier,
      SupplierFilter,
      SupplierRelations,
      SupplierParams
    >(apiFetcher, `/suppliers/${id}`, options);
  };

  static createSupplier = async (
    SupplierDto: SupplierDto
  ): Promise<DataResponse<Supplier>> => {
    try {
      const data = await SharedService.create<
        DataResponse<Supplier>,
        SupplierDto
      >(apiFetcher, '/suppliers', SupplierDto);

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static updateSupplier = async (
    id: number,
    SupplierDto: SupplierDto
  ): Promise<DataResponse<Supplier>> => {
    try {
      const data = await SharedService.update<
        DataResponse<Supplier>,
        SupplierDto
      >(apiFetcher, `/suppliers/${id}`, SupplierDto);

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };
}
