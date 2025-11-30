import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { 
    Suburb, 
    SuburbsParams
} from '@/features/suburbs/suburb.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { SuburbService } from '@/features/suburbs/suburb.service';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<Suburb>>,
    'queryKey' | 'queryFn'
  > {
  options: SuburbsParams;
}

export const processesKeys = {
  all: () => ['suburbs'],
  list: (params?: SuburbsParams) => [...processesKeys.all(), 'list', params],
  detail: (id: number) => [...processesKeys.all(), 'detail', id]
} as const;

export const useSuburbsQuery = ({ options, ...rest }: QueryOptions) => {
  return useQuery({
    queryKey: processesKeys.list(options),
    queryFn: () => SuburbService.findAllSuburbs(options),
    ...rest
  });
};