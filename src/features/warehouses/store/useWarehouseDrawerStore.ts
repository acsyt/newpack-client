import { Warehouse, WarehouseLocation } from '../warehouse.interface';

import { createDrawerStore } from '@/hooks/useDrawerStore';

export const useWarehouseDrawerStore = createDrawerStore<Warehouse>();

export const useWarehouseLocationDrawerStore =
  createDrawerStore<WarehouseLocation>();
