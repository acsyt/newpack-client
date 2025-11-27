import type {
  MachineParams,
  Machine
} from '@/features/machines/machine.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MachineDto } from '../machine.schema';

import { CustomError } from '@/config/custom.error';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { MachineService } from '@/features/machines/machine.service';
import { DataResponse } from '@/interfaces/data-response.interface';

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

export const useSaveDrawerMutation = ({
  mode,
  id,
  machineParams
}: {
  mode: ModeAction;
  id?: number;
  machineParams: MachineParams;
}) => {
  const queryClient = useQueryClient();

  return useMutation<DataResponse<Machine>, CustomError, MachineDto>({
    mutationFn: machineDto => {
      if (mode === ModeAction.Create)
        return MachineService.createMachine(machineDto);
      if (id && id > 0 && mode === ModeAction.Edit)
        return MachineService.updateMachine(id, machineDto);
      throw new CustomError('No se puede guardar la maquina');
    },
    onSuccess: () => {
      const machinesQueryKey = machinesKeys.list(machineParams);

      queryClient.invalidateQueries({ queryKey: machinesQueryKey });
    }
  });
};
