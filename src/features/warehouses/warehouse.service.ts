import type {
  WarehouseParams,
  Warehouse,
  WarehouseFilter,
  WarehouseRelations,
  WarehouseLocationParams,
  WarehouseLocation,
  WarehouseLocationFilter,
  WarehouseLocationRelations
} from '@/features/warehouses/warehouse.interface';
import type {
  WarehouseDto,
  WarehouseLocationDto
} from '@/features/warehouses/warehouse.schema';
import type { DataResponse } from '@/interfaces/data-response.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';
import { getErrorMessage } from '@/config/error.mapper';

export class WarehouseService extends SharedService {
  static findAllWarehouses = async (
    options: WarehouseParams
  ): Promise<PaginationResponse<Warehouse>> => {
    return SharedService.findAll<
      Warehouse,
      WarehouseFilter,
      WarehouseRelations,
      WarehouseParams
    >(apiFetcher, '/warehouses', options);
  };

  static findWarehouseById = async (
    id: number,
    options: WarehouseParams
  ): Promise<Warehouse> => {
    return SharedService.findOne<
      Warehouse,
      WarehouseFilter,
      WarehouseRelations,
      WarehouseParams
    >(apiFetcher, `/warehouses/${id}`, options);
  };

  static createWarehouse = async (
    warehouseDto: WarehouseDto
  ): Promise<DataResponse<Warehouse>> => {
    try {
      const data = await SharedService.create<
        DataResponse<Warehouse>,
        WarehouseDto
      >(apiFetcher, '/warehouses', warehouseDto);

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static updateWarehouse = async (
    id: number,
    warehouseDto: WarehouseDto
  ): Promise<DataResponse<Warehouse>> => {
    try {
      const data = await SharedService.update<
        DataResponse<Warehouse>,
        WarehouseDto
      >(apiFetcher, `/warehouses/${id}`, warehouseDto);

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static findAllWarehouseLocations = async (
    options: WarehouseLocationParams
  ): Promise<PaginationResponse<WarehouseLocation>> => {
    return SharedService.findAll<
      WarehouseLocation,
      WarehouseLocationFilter,
      WarehouseLocationRelations,
      WarehouseLocationParams
    >(apiFetcher, '/warehouse-locations', options);
  };

  static findWarehouseLocationById = async (
    id: number,
    options: WarehouseLocationParams
  ): Promise<WarehouseLocation> => {
    return SharedService.findOne<
      WarehouseLocation,
      WarehouseLocationFilter,
      WarehouseLocationRelations,
      WarehouseLocationParams
    >(apiFetcher, `/warehouse-locations/${id}`, options);
  };

  static createWarehouseLocation = async (
    locationDto: WarehouseLocationDto
  ): Promise<DataResponse<WarehouseLocation>> => {
    try {
      const data = await SharedService.create<
        DataResponse<WarehouseLocation>,
        WarehouseLocationDto
      >(apiFetcher, '/warehouse-locations', locationDto);

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static updateWarehouseLocation = async (
    id: number,
    locationDto: WarehouseLocationDto
  ): Promise<DataResponse<WarehouseLocation>> => {
    try {
      const data = await SharedService.update<
        DataResponse<WarehouseLocation>,
        WarehouseLocationDto
      >(apiFetcher, `/warehouse-locations/${id}`, locationDto);

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static deleteWarehouseLocation = async (
    id: number
  ): Promise<DataResponse<null>> => {
    try {
      const data = await apiFetcher.delete<DataResponse<null>>(
        `/warehouse-locations/${id}`
      );

      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };
}
