import type {
  InventoryMovementParams,
  InventoryMovement
} from '@/features/inventory-movements/inventory-movement.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { InventoryMovementService } from '@/features/inventory-movements/inventory-movement.service';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<InventoryMovement>>,
    'queryKey' | 'queryFn'
  > {
  options: InventoryMovementParams;
}

export const inventoryMovementsKeys = {
  all: () => ['inventory-movements'],
  list: (params?: InventoryMovementParams) => [
    ...inventoryMovementsKeys.all(),
    'list',
    params
  ],
  detail: (id: number) => [...inventoryMovementsKeys.all(), 'detail', id]
} as const;

export const useInventoryMovementsQuery = ({
  options,
  ...rest
}: QueryOptions) => {
  return useQuery({
    queryKey: inventoryMovementsKeys.list(options),
    queryFn: () => InventoryMovementService.findAllMovements(options),
    ...rest
  });
};

interface MovementQueryOptionsById
  extends Omit<UseQueryOptions<InventoryMovement>, 'queryKey' | 'queryFn'> {
  id: number;
  options: InventoryMovementParams;
}

export const useInventoryMovementByIdQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: MovementQueryOptionsById) => {
  return useQuery({
    queryKey: inventoryMovementsKeys.detail(id),
    queryFn: () => InventoryMovementService.findMovementById(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};
