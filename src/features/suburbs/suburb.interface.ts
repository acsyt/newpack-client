import { BasePaginationParams } from "@/interfaces/pagination-response.interface";

export interface Suburb {
  id: number;
  name: string;
  zipCodeId: number;
}

export interface SuburbFilter {
  id?: number[];
}

export type SuburbRelations = '';

export interface SuburbsParams
  extends BasePaginationParams<SuburbFilter, SuburbRelations> {}

