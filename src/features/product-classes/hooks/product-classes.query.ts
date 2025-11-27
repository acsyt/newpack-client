import type {
  ProductClassParams,
  ProductClass
} from '@/features/product-classes/product-class.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { ProductClassService } from '@/features/product-classes/product-class.service';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<ProductClass>>,
    'queryKey' | 'queryFn'
  > {
  options: ProductClassParams;
}

export const productClassesKeys = {
  all: () => ['product-classes'],
  list: (params?: ProductClassParams) => [
    ...productClassesKeys.all(),
    'list',
    params
  ],
  detail: (id: number) => [...productClassesKeys.all(), 'detail', id]
} as const;

export const useProductClassesQuery = ({ options, ...rest }: QueryOptions) => {
  return useQuery({
    queryKey: productClassesKeys.list(options),
    queryFn: () => ProductClassService.findAllProductClasses(options),
    ...rest
  });
};

interface ProductClassQueryOptionsById
  extends Omit<UseQueryOptions<ProductClass>, 'queryKey' | 'queryFn'> {
  id: number;
  options: ProductClassParams;
}

export const useProductClassByIdQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: ProductClassQueryOptionsById) => {
  return useQuery({
    queryKey: productClassesKeys.detail(id),
    queryFn: () => ProductClassService.findProductClassByIdAction(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};
