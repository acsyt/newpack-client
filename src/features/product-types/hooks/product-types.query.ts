import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductType, ProductTypeParams } from '../product-type.interface';
import { ProductTypeService } from '../product-type.service';

import { PaginationResponse } from '@/interfaces/pagination-response.interface';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<ProductType>>,
    'queryKey' | 'queryFn'
  > {
  options?: ProductTypeParams;
}

export const productTypesKeys = {
  all: () => ['product-types'],
  list: (params?: ProductTypeParams) => [
    ...productTypesKeys.all(),
    'list',
    params
  ]
} as const;

export const useProductTypesQuery = ({
  options,
  ...rest
}: QueryOptions = {}) => {
  return useQuery({
    queryKey: productTypesKeys.list(options),
    queryFn: () => ProductTypeService.findAllProductTypes(options || {}),
    ...rest
  });
};
