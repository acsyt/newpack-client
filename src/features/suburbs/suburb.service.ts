import type {
  Suburb,
  SuburbFilter,
  SuburbRelations,
  SuburbsParams
} from '@/features/suburbs/suburb.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';

export class SuburbService extends SharedService {
  static findAllSuburbs = async (
    options: SuburbsParams
  ): Promise<PaginationResponse<Suburb>> => {
    return SharedService.findAll<
      Suburb,
      SuburbFilter,
      SuburbRelations,
      SuburbsParams
    >(apiFetcher, '/suburbs', options);
  };
}
