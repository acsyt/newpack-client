import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

export interface Process {
  id: number;
  code: string;
  name: string;
  appliesToPt: boolean;
  appliesToMp: boolean;
  appliesToCompounds: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessFilter {
  id?: number[];
  code?: string;
  name?: string;
  appliesToPt?: boolean;
  appliesToMp?: boolean;
  appliesToCompounds?: boolean;
  search?: string;
}

export type ProcessRelations = never;

export interface ProcessParams
  extends BasePaginationParams<ProcessFilter, ProcessRelations> {}
