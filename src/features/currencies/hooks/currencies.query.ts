import type {
  CurrencyParams,
  Currency
} from '@/features/currencies/currency.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { CurrencyService } from '@/features/currencies/currency.service';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<Currency>>,
    'queryKey' | 'queryFn'
  > {
  options: CurrencyParams;
}

export const currenciesKeys = {
  all: () => ['currencies'],
  list: (params?: CurrencyParams) => [...currenciesKeys.all(), 'list', params],
  detail: (id: number) => [...currenciesKeys.all(), 'detail', id]
} as const;

export const useCurrenciesQuery = ({ options, ...rest }: QueryOptions) => {
  return useQuery({
    queryKey: currenciesKeys.list(options),
    queryFn: () => CurrencyService.findAllCurrencies(options),
    ...rest
  });
};

interface CurrencyQueryOptionsById
  extends Omit<UseQueryOptions<Currency>, 'queryKey' | 'queryFn'> {
  id: number;
  options: CurrencyParams;
}

export const useCurrencyByIdQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: CurrencyQueryOptionsById) => {
  return useQuery({
    queryKey: currenciesKeys.detail(id),
    queryFn: () => CurrencyService.findCurrencyByIdAction(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};
