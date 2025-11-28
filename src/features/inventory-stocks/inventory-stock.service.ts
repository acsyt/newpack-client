import type {
  InventoryStockParams,
  InventoryStock,
  InventoryStockFilter,
  InventoryStockRelations
} from '@/features/inventory-stocks/inventory-stock.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';

export class InventoryStockService extends SharedService {
  static findAllStocks = async (
    options: InventoryStockParams
  ): Promise<PaginationResponse<InventoryStock>> => {
    return SharedService.findAll<
      InventoryStock,
      InventoryStockFilter,
      InventoryStockRelations,
      InventoryStockParams
    >(apiFetcher, '/inventory/stocks', options);
  };

  static findStockById = async (
    id: number,
    options: InventoryStockParams
  ): Promise<InventoryStock> => {
    return SharedService.findOne<
      InventoryStock,
      InventoryStockFilter,
      InventoryStockRelations,
      InventoryStockParams
    >(apiFetcher, `/inventory/stocks/${id}`, options);
  };
}
