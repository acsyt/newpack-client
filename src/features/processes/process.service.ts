import type {
  ProcessParams,
  Process,
  ProcessFilter,
  ProcessRelations
} from '@/features/processes/process.interface';
import type { ProcessDto } from '@/features/processes/process.schema';
import type { DataResponse } from '@/interfaces/data-response.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';
import { getErrorMessage } from '@/config/error.mapper';

export class ProcessService extends SharedService {
  static findAllProcesses = async (
    options: ProcessParams
  ): Promise<PaginationResponse<Process>> => {
    return SharedService.findAll<
      Process,
      ProcessFilter,
      ProcessRelations,
      ProcessParams
    >(apiFetcher, '/processes', options);
  };

  static findProcessByIdAction = async (
    id: number,
    options: ProcessParams
  ): Promise<Process> => {
    return SharedService.findOne<
      Process,
      ProcessFilter,
      ProcessRelations,
      ProcessParams
    >(apiFetcher, `/processes/${id}`, options);
  };

  static createProcess = async (
    processDto: ProcessDto
  ): Promise<DataResponse<Process>> => {
    try {
      const data = await SharedService.create<
        DataResponse<Process>,
        ProcessDto
      >(apiFetcher, '/processes', processDto);

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static updateProcess = async (
    id: number,
    processDto: ProcessDto
  ): Promise<DataResponse<Process>> => {
    try {
      const data = await SharedService.update<
        DataResponse<Process>,
        ProcessDto
      >(apiFetcher, `/processes/${id}`, processDto);

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };
}
