import { BasePaginationParams } from '../../interfaces/pagination-response.interface';

export interface Currency {
  id: number;
  name: string;
  code: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface CurrencyFilter {
  id?: number[];
  name?: string;
  code?: string;
  active?: boolean;
}

export type CurrencyRelations = '';

export interface CurrencyParams
  extends BasePaginationParams<CurrencyFilter, CurrencyRelations> {}
