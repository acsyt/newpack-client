import type { Supplier, SupplierParams } from '@/features/suppliers/supplier.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { SupplierService } from '@/features/suppliers/supplier.service';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<Supplier>>,
    'queryKey' | 'queryFn'
  > {
  options: SupplierParams
}

export const suppliersKeys = {
  all: () => ['suppliers'],
  list: (params?: SupplierParams) => [...suppliersKeys.all(), 'list', params],
  detail: (id: number) => [...suppliersKeys.all(), 'detail', id]
} as const;

export const useSupplierQuery = ({ options, ...rest }: QueryOptions) => {
  return useQuery({
    queryKey: suppliersKeys.list(options),
    queryFn: () => SupplierService.findAllSuppliers(options),
    ...rest
  });
};

interface SupplierQueryOptionsById
  extends Omit<UseQueryOptions<Supplier>, 'queryKey' | 'queryFn'> {
  id: number;
  options: SupplierParams;
}

export const useSupplierByIdQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: SupplierQueryOptionsById) => {
  return useQuery({
    queryKey: suppliersKeys.detail(id),
    queryFn: () => SupplierService.findSupplierByIdAction(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};
