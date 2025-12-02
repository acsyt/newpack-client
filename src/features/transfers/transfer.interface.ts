import { Warehouse } from '../warehouses/warehouse.interface';
import { User } from '../users/user.interface';
import { Product } from '../products/product.interface';
import { WarehouseLocation } from '../warehouses/warehouse.interface';
import { Batch } from '../batches/batch.interface';
import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

export enum TransferStatus {
  Pending = 'pending',
  Shipped = 'shipped',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export interface Transfer {
  id: number;
  transferNumber: string;
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  status: TransferStatus;
  shippedAt?: string | null;
  receivedAt?: string | null;
  shippedByUserId?: number | null;
  receivedByUserId?: number | null;
  notes?: string | null;
  receivingNotes?: string | null;
  totalItemsCount?: number;
  hasDiscrepancies?: boolean;
  items?: TransferItem[];
  sourceWarehouse?: Warehouse;
  destinationWarehouse?: Warehouse;
  shippedByUser?: User;
  receivedByUser?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TransferItem {
  id: number;
  transferId: number;
  productId: number;
  warehouseLocationSourceId?: number | null;
  warehouseLocationDestinationId?: number | null;
  batchId?: number | null;
  quantitySent: string | number;
  quantityReceived?: string | number | null;
  quantityMissing?: string | number | null;
  quantityDamaged?: string | number | null;
  quantityDiscrepancy?: string | number | null;
  notes?: string | null;
  product?: Product;
  sourceLocation?: WarehouseLocation;
  destinationLocation?: WarehouseLocation;
  batch?: Batch;
  createdAt: string;
  updatedAt: string;
}

export interface TransferFilter {
  status?: TransferStatus | TransferStatus[];
  source_warehouse_id?: number | number[];
  destination_warehouse_id?: number | number[];
  search?: string;
  shipped_at?: string;
  received_at?: string;
  created_at?: string;
}

export type TransferRelations =
  | 'items'
  | 'items.product'
  | 'items.product.measureUnit'
  | 'items.product.productType'
  | 'items.sourceLocation'
  | 'items.destinationLocation'
  | 'items.batch'
  | 'sourceWarehouse'
  | 'destinationWarehouse'
  | 'shippedByUser'
  | 'receivedByUser'
  | 'inventoryMovements'
  | 'inventoryMovements.product';

export interface TransferParams
  extends BasePaginationParams<TransferFilter, TransferRelations> {}
