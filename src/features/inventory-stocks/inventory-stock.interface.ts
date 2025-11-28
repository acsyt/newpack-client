import { Batch } from '@/features/batches/batch.interface';
import { Product } from '@/features/products/product.interface';
import {
  Warehouse,
  WarehouseLocation
} from '@/features/warehouses/warehouse.interface';
import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

export interface InventoryStock {
  id: number;
  productId: number;
  warehouseId: number;
  warehouseLocationId: number | null;
  batchId: number | null;
  quantity: number;
  status: 'available' | 'reserved' | 'damaged';
  product?: Product;
  warehouse?: Warehouse;
  warehouseLocation?: WarehouseLocation;
  batch?: Batch;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryStockFilter {
  product_id?: number;
  warehouse_id?: number;
  warehouse_location_id?: number;
  batch_id?: number;
  status?: 'available' | 'reserved' | 'damaged';
}

export type InventoryStockRelations =
  | 'product'
  | 'product.measureUnit'
  | 'warehouse'
  | 'warehouseLocation'
  | 'batch';

export interface InventoryStockParams
  extends BasePaginationParams<InventoryStockFilter, InventoryStockRelations> {}
