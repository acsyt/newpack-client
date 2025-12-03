import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

export interface ProductType {
  id: number;
  name: string;
  code: string;
  slug: string;
}

export interface ProductTypeFilter {
  id?: number[];
}

export type ProductTypeRelations = '';

export interface ProductTypeParams
  extends BasePaginationParams<ProductTypeFilter, ProductTypeRelations> {}
