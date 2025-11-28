import type {
  WarehouseParams,
  Warehouse,
  WarehouseLocationParams,
  WarehouseLocation
} from '@/features/warehouses/warehouse.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { WarehouseDto, WarehouseLocationDto } from '../warehouse.schema';

import { CustomError } from '@/config/custom.error';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { WarehouseService } from '@/features/warehouses/warehouse.service';
import { DataResponse } from '@/interfaces/data-response.interface';

interface WarehouseQueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<Warehouse>>,
    'queryKey' | 'queryFn'
  > {
  options: WarehouseParams;
}

export const warehousesKeys = {
  all: () => ['warehouses'],
  list: (params?: WarehouseParams) => [...warehousesKeys.all(), 'list', params],
  detail: (id: number) => [...warehousesKeys.all(), 'detail', id]
} as const;

export const useWarehousesQuery = ({
  options,
  ...rest
}: WarehouseQueryOptions) => {
  return useQuery({
    queryKey: warehousesKeys.list(options),
    queryFn: () => WarehouseService.findAllWarehouses(options),
    ...rest
  });
};

interface WarehouseQueryOptionsById
  extends Omit<UseQueryOptions<Warehouse>, 'queryKey' | 'queryFn'> {
  id: number;
  options: WarehouseParams;
}

export const useWarehouseByIdQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: WarehouseQueryOptionsById) => {
  return useQuery({
    queryKey: warehousesKeys.detail(id),
    queryFn: () => WarehouseService.findWarehouseById(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};

export const useSaveWarehouseMutation = ({
  mode,
  id,
  warehouseParams
}: {
  mode: ModeAction;
  id?: number;
  warehouseParams: WarehouseParams;
}) => {
  const queryClient = useQueryClient();

  return useMutation<DataResponse<Warehouse>, CustomError, WarehouseDto>({
    mutationFn: warehouseDto => {
      if (mode === ModeAction.Create)
        return WarehouseService.createWarehouse(warehouseDto);
      if (id && id > 0 && mode === ModeAction.Edit)
        return WarehouseService.updateWarehouse(id, warehouseDto);
      throw new CustomError('No se puede guardar el almacén');
    },
    onSuccess: () => {
      const warehousesQueryKey = warehousesKeys.list(warehouseParams);

      queryClient.invalidateQueries({ queryKey: warehousesQueryKey });
    }
  });
};

interface WarehouseLocationQueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<WarehouseLocation>>,
    'queryKey' | 'queryFn'
  > {
  options: WarehouseLocationParams;
}

export const warehouseLocationsKeys = {
  all: () => ['warehouse-locations'],
  list: (params?: WarehouseLocationParams) => [
    ...warehouseLocationsKeys.all(),
    'list',
    params
  ],
  detail: (id: number) => [...warehouseLocationsKeys.all(), 'detail', id],
  byWarehouse: (warehouseId: number) => [
    ...warehouseLocationsKeys.all(),
    'by-warehouse',
    warehouseId
  ]
} as const;

export const useWarehouseLocationsQuery = ({
  options,
  ...rest
}: WarehouseLocationQueryOptions) => {
  return useQuery({
    queryKey: warehouseLocationsKeys.list(options),
    queryFn: () => WarehouseService.findAllWarehouseLocations(options),
    ...rest
  });
};

interface WarehouseLocationQueryOptionsById
  extends Omit<UseQueryOptions<WarehouseLocation>, 'queryKey' | 'queryFn'> {
  id: number;
  options: WarehouseLocationParams;
}

export const useWarehouseLocationByIdQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: WarehouseLocationQueryOptionsById) => {
  return useQuery({
    queryKey: warehouseLocationsKeys.detail(id),
    queryFn: () => WarehouseService.findWarehouseLocationById(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};

export const useSaveWarehouseLocationMutation = ({
  mode,
  id,
  warehouseId
}: {
  mode: ModeAction;
  id?: number;
  warehouseId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    DataResponse<WarehouseLocation>,
    CustomError,
    WarehouseLocationDto
  >({
    mutationFn: locationDto => {
      if (mode === ModeAction.Create)
        return WarehouseService.createWarehouseLocation(locationDto);
      if (id && id > 0 && mode === ModeAction.Edit)
        return WarehouseService.updateWarehouseLocation(id, locationDto);
      throw new CustomError('No se puede guardar la ubicación');
    },
    onSuccess: () => {
      const locationsQueryKey = warehouseLocationsKeys.list({
        filter: { warehouse_id: [warehouseId] }
      });

      queryClient.invalidateQueries({ queryKey: locationsQueryKey });
    }
  });
};

export const useDeleteWarehouseLocationMutation = ({
  warehouseId
}: {
  warehouseId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation<DataResponse<null>, CustomError, number>({
    mutationFn: locationId =>
      WarehouseService.deleteWarehouseLocation(locationId),
    onSuccess: () => {
      const locationsQueryKey = warehouseLocationsKeys.list({
        filter: { warehouse_id: [warehouseId] }
      });

      queryClient.invalidateQueries({ queryKey: locationsQueryKey });
    }
  });
};
