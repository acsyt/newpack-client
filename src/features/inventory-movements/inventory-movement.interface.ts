import { User } from '../users/user.interface';

import { Batch } from '@/features/batches/batch.interface';
import { Product } from '@/features/products/product.interface';
import {
  Warehouse,
  WarehouseLocation
} from '@/features/warehouses/warehouse.interface';
import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

export enum MovementType {
  Entry = 'entry',
  Exit = 'exit',
  Transfer = 'transfer'
}

export interface InventoryMovement {
  id: number;
  productId: number;
  warehouseId: number;
  warehouseLocationId: number | null;
  type: MovementType;
  quantity: number;
  balanceAfter: number;
  batchId: number | null;
  userId: number | null;
  referenceType: string | null;
  referenceId: number | null;
  notes: string | null;
  product?: Product;
  warehouse?: Warehouse;
  warehouseLocation?: WarehouseLocation;
  batch?: Batch;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovementFilter {
  product_id?: number;
  warehouse_id?: number;
  warehouse_location_id?: number;
  type?: MovementType;
  user_id?: number;
  created_at?: string;
}

export type InventoryMovementRelations =
  | 'product'
  | 'product.measureUnit'
  | 'warehouse'
  | 'warehouseLocation'
  | 'batch'
  | 'user'
  | 'reference';

export interface InventoryMovementParams
  extends BasePaginationParams<
    InventoryMovementFilter,
    InventoryMovementRelations
  > {}
