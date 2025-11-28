import type {
  InventoryStockParams,
  InventoryStock
} from '@/features/inventory-stocks/inventory-stock.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { InventoryStockService } from '@/features/inventory-stocks/inventory-stock.service';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<InventoryStock>>,
    'queryKey' | 'queryFn'
  > {
  options: InventoryStockParams;
}

export const inventoryStocksKeys = {
  all: () => ['inventory-stocks'],
  list: (params?: InventoryStockParams) => [
    ...inventoryStocksKeys.all(),
    'list',
    params
  ],
  detail: (id: number) => [...inventoryStocksKeys.all(), 'detail', id]
} as const;

export const useInventoryStocksQuery = ({ options, ...rest }: QueryOptions) => {
  return useQuery({
    queryKey: inventoryStocksKeys.list(options),
    queryFn: () => InventoryStockService.findAllStocks(options),
    ...rest
  });
};

interface StockQueryOptionsById
  extends Omit<UseQueryOptions<InventoryStock>, 'queryKey' | 'queryFn'> {
  id: number;
  options: InventoryStockParams;
}

export const useInventoryStockByIdQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: StockQueryOptionsById) => {
  return useQuery({
    queryKey: inventoryStocksKeys.detail(id),
    queryFn: () => InventoryStockService.findStockById(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};
