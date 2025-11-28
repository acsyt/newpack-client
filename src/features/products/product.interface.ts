import { MeasureUnit } from '@/interfaces/measure-unit.interface';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  type?: string;
  measureUnitId?: number;
  measureUnit?: MeasureUnit;
  productClassId?: number;
  productSubclassId?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
