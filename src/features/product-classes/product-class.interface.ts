import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

export interface ProductClass {
  id: number;
  code: string;
  name: string;
  description: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductClassFilter {
  id?: number[];
  code?: string;
  name?: string;
  description?: string;
  search?: string;
}

export type ProductClassRelations = never;

export interface ProductClassParams
  extends BasePaginationParams<ProductClassFilter, ProductClassRelations> {}
