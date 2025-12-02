import { ProductClass } from '../product-classes/product-class.interface';
import { ProductSubclass } from '../product-subclasses';

import { MeasureUnit } from '@/interfaces/measure-unit.interface';
import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

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
  | 'productType';

export interface ProductParams
  extends BasePaginationParams<ProductFilter, ProductRelations> {}
