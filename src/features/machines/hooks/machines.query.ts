import type {
  MachineParams,
  Machine
} from '@/features/machines/machine.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { MachineService } from '@/features/machines/machine.service';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<Machine>>,
    'queryKey' | 'queryFn'
  > {
  options: MachineParams;
}

export const machinesKeys = {
  all: () => ['machines'],
  list: (params?: MachineParams) => [...machinesKeys.all(), 'list', params],
  detail: (id: number) => [...machinesKeys.all(), 'detail', id]
} as const;

export const useMachinesQuery = ({ options, ...rest }: QueryOptions) => {
  return useQuery({
    queryKey: machinesKeys.list(options),
    queryFn: () => MachineService.findAllMachines(options),
    ...rest
  });
};

interface MachineQueryOptionsById
  extends Omit<UseQueryOptions<Machine>, 'queryKey' | 'queryFn'> {
  id: number;
  options: MachineParams;
}

export const useMachineByIdQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: MachineQueryOptionsById) => {
  return useQuery({
    queryKey: machinesKeys.detail(id),
    queryFn: () => MachineService.findMachineByIdAction(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};
