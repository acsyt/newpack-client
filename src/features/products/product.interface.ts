import { ProductClass } from '../product-classes/product-class.interface';
import { ProductSubclass } from '../product-subclasses';

import { createDrawerStore } from '@/hooks/useDrawerStore';
import { MeasureUnit } from '@/interfaces/measure-unit.interface';
import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

export interface ProductIngredient extends Product {
  quantity?: number;
  wastagePercent?: number;
  processStage?: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  productTypeId?: number;
  productType?: ProductType;
  measureUnitId?: number;
  measureUnit?: MeasureUnit;
  productClassId?: number;
  productClass?: ProductClass;
  productSubclassId?: number;
  productSubclass?: ProductSubclass;
  active?: boolean;
  ingredients?: ProductIngredient[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductType {
  id: number;
  name: string;
}

export type ProductTypeCode = 'PT' | 'MP' | 'SERV' | 'COMP' | 'REF';

export interface ProductFilter {
  id?: number[];
  type?: ProductTypeCode;
}

export type ProductRelations =
  | 'measureUnit'
  | 'productClass'
  | 'productSubclass'
  | 'productType'
  | 'ingredients'
  | 'ingredients.productType'
  | 'ingredients.measureUnit';

export interface ProductParams
  extends BasePaginationParams<ProductFilter, ProductRelations> {}

export const useProductDrawerStore = createDrawerStore<Product>();
