import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { Customer, CustomerParams } from '../customer.interface';
import { CustomerService } from '../customer.service';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<Customer>>,
    'queryKey' | 'queryFn'
  > {
  options: CustomerParams;
}

export const customersKeys = {
  all: () => ['customers'],
  list: (params?: CustomerParams) => [...customersKeys.all(), 'list', params],
  detail: (id: number) => [...customersKeys.all(), 'detail', id]
} as const;

export const useCustomerQuery = ({ options, ...rest }: QueryOptions) => {
  return useQuery({
    queryKey: customersKeys.list(options),
    queryFn: () => CustomerService.findAllCustomers(options),
    ...rest
  });
};

interface CustomerQueryOptionsById
  extends Omit<UseQueryOptions<Customer>, 'queryKey' | 'queryFn'> {
  id: number;
  options: CustomerParams;
}

//useUserByIdQuery
export const useCustomerByIdQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: CustomerQueryOptionsById) => {
  return useQuery({
    queryKey: customersKeys.detail(id),
    queryFn: () => CustomerService.findCustomerByIdAction(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};
