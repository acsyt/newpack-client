import type {
  InventoryMovementParams,
  InventoryMovement,
  InventoryMovementFilter,
  InventoryMovementRelations
} from '@/features/inventory-movements/inventory-movement.interface';
import type { InventoryMovementDto } from '@/features/inventory-movements/inventory-movement.schema';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';

export class InventoryMovementService extends SharedService {
  static findAllMovements = async (
    options: InventoryMovementParams
  ): Promise<PaginationResponse<InventoryMovement>> => {
    return SharedService.findAll<
      InventoryMovement,
      InventoryMovementFilter,
      InventoryMovementRelations,
      InventoryMovementParams
    >(apiFetcher, '/inventory/movements', options);
  };

  static findMovementById = async (
    id: number,
    options: InventoryMovementParams
  ): Promise<InventoryMovement> => {
    return SharedService.findOne<
      InventoryMovement,
      InventoryMovementFilter,
      InventoryMovementRelations,
      InventoryMovementParams
    >(apiFetcher, `/inventory/movements/${id}`, options);
  };

  static createMovement = async (
    data: InventoryMovementDto
  ): Promise<InventoryMovement> => {
    return SharedService.create<InventoryMovement, InventoryMovementDto>(
      apiFetcher,
      '/inventory/movements',
      data
    );
  };

  static createTransfer = async (data: any): Promise<void> => {
    await apiFetcher.post('/inventory/movements/transfer', data);
  };
}
