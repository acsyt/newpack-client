import type {
  ProcessParams,
  Process
} from '@/features/processes/process.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { ProcessService } from '@/features/processes/process.service';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<Process>>,
    'queryKey' | 'queryFn'
  > {
  options: ProcessParams;
}

export const processesKeys = {
  all: () => ['processes'],
  list: (params?: ProcessParams) => [...processesKeys.all(), 'list', params],
  detail: (id: number) => [...processesKeys.all(), 'detail', id]
} as const;

export const useProcessesQuery = ({ options, ...rest }: QueryOptions) => {
  return useQuery({
    queryKey: processesKeys.list(options),
    queryFn: () => ProcessService.findAllProcesses(options),
    ...rest
  });
};

interface ProcessQueryOptionsById
  extends Omit<UseQueryOptions<Process>, 'queryKey' | 'queryFn'> {
  id: number;
  options: ProcessParams;
}

export const useProcessByIdQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: ProcessQueryOptionsById) => {
  return useQuery({
    queryKey: processesKeys.detail(id),
    queryFn: () => ProcessService.findProcessByIdAction(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};
