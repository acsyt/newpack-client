import type {
  MachineParams,
  Machine,
  MachineFilter,
  MachineRelations
} from '@/features/machines/machine.interface';
import type { MachineDto } from '@/features/machines/machine.schema';
import type { DataResponse } from '@/interfaces/data-response.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';
import { getErrorMessage } from '@/config/error.mapper';

export class MachineService extends SharedService {
  static findAllMachines = async (
    options: MachineParams
  ): Promise<PaginationResponse<Machine>> => {
    return SharedService.findAll<
      Machine,
      MachineFilter,
      MachineRelations,
      MachineParams
    >(apiFetcher, '/machines', options);
  };

  static findMachineByIdAction = async (
    id: number,
    options: MachineParams
  ): Promise<Machine> => {
    return SharedService.findOne<
      Machine,
      MachineFilter,
      MachineRelations,
      MachineParams
    >(apiFetcher, `/machines/${id}`, options);
  };

  static createMachine = async (
    machineDto: MachineDto
  ): Promise<DataResponse<Machine>> => {
    try {
      const data = await SharedService.create<DataResponse<Machine>, MachineDto>(
        apiFetcher,
        '/machines',
        machineDto
      );

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static updateMachine = async (
    id: number,
    machineDto: MachineDto
  ): Promise<DataResponse<Machine>> => {
    try {
      const data = await SharedService.update<DataResponse<Machine>, MachineDto>(
        apiFetcher,
        `/machines/${id}`,
        machineDto
      );

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };
}
