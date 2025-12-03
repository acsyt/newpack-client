import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

export interface Supplier {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  phoneSecondary: string;
  suburbId: number;
  street: string;
  exteriorNumber: string;
  interiorNumber?: string | null;
  addressReference?: string | null;
  fullAddress: string;
  rfc: string;
  legalName: string;
  taxSystem: string;
  status: 'active' | 'inactive' | 'suspended' | 'blacklisted';
  notes?: string | null;
  createdBy: number;
  updatedBy: number;
  deletedBy?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  suburb: Suburb;
}

interface Suburb {
  id: number;
  name: string;
  zipCodeId: number;
  zipCode: ZipCode;
}

interface ZipCode {
  id: number;
  name: string;
  city: City;
}

interface City {
  id: number;
  name: string;
  state: State;
}

interface State {
  id: number;
  code: string;
  name: string;
}

export interface SupplierFilter {
  id?: number[];
}

export type SupplierRelations = 'suburb.zipCode';

export interface SupplierParams
  extends BasePaginationParams<SupplierFilter, SupplierRelations> {}
