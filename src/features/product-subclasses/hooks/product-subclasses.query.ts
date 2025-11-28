import type {
  ProductSubclassParams,
  ProductSubclass
} from '@/features/product-subclasses/product-subclass.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { ProductSubclassService } from '@/features/product-subclasses/product-subclass.service';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<ProductSubclass>>,
    'queryKey' | 'queryFn'
  > {
  options: ProductSubclassParams;
}

export const productSubclassesKeys = {
  all: () => ['product-subclasses'],
  list: (params?: ProductSubclassParams) => [
    ...productSubclassesKeys.all(),
    'list',
    params
  ],
  detail: (id: number) => [...productSubclassesKeys.all(), 'detail', id]
} as const;

export const useProductSubclassesQuery = ({
  options,
  ...rest
}: QueryOptions) => {
  return useQuery({
    queryKey: productSubclassesKeys.list(options),
    queryFn: () => ProductSubclassService.findAllProductSubclasses(options),
    ...rest
  });
};

interface ProductSubclassQueryOptionsById
  extends Omit<UseQueryOptions<ProductSubclass>, 'queryKey' | 'queryFn'> {
  id: number;
  options: ProductSubclassParams;
}

export const useProductSubclassByIdQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: ProductSubclassQueryOptionsById) => {
  return useQuery({
    queryKey: productSubclassesKeys.detail(id),
    queryFn: () =>
      ProductSubclassService.findProductSubclassByIdAction(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};
