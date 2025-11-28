import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

export interface ProductSubclass {
  id: number;
  code: string;
  name: string;
  description: string | null;
  slug: string;
  productClassId: number;
  productClass?: {
    id: number;
    code: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductSubclassFilter {
  id?: number[];
  code?: string;
  name?: string;
  description?: string;
  productClassId?: number;
  search?: string;
}

export type ProductSubclassRelations = 'productClass';

export interface ProductSubclassParams
  extends BasePaginationParams<
    ProductSubclassFilter,
    ProductSubclassRelations
  > {}
