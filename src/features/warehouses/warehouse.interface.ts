import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

export interface WarehouseLocation {
  id: number;
  uniqueId: string;
  warehouseId: number;
  warehouse?: Warehouse;
  aisle?: string | null;
  shelf?: string | null;
  section?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: number;
  type: string;
  name: string;
  active: boolean;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
  warehouseLocations?: WarehouseLocation[];
  warehouseLocationsCount: number;
}

export interface WarehouseFilter {
  id?: number[];
  name?: string;
  type?: string;
  active?: boolean;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type WarehouseRelations = 'warehouseLocations';

export interface WarehouseParams
  extends BasePaginationParams<WarehouseFilter, WarehouseRelations> {}

export type WarehouseLocationRelations = 'warehouse';

export interface WarehouseLocationFilter {
  id?: number[];
  warehouse_id?: number[];
  aisle?: string;
  shelf?: string;
  section?: string;
  unique_id?: string;
}

export interface WarehouseLocationParams
  extends BasePaginationParams<
    WarehouseLocationFilter,
    WarehouseLocationRelations
  > {}

export const WAREHOUSE_TYPES = {
  MAIN: 'main',
  SECONDARY: 'secondary',
  STORE: 'store'
} as const;

export type WarehouseType =
  (typeof WAREHOUSE_TYPES)[keyof typeof WAREHOUSE_TYPES];
