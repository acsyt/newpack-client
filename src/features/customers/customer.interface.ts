import { BasePaginationParams } from "@/interfaces/pagination-response.interface";

export interface Customer {
  id: number;
  name: string;
  lastName: string;
  fullName: string;
  email: string;
  emailVerifiedAt: string; // ISO date string
  phone: string;
  phoneSecondary: string;
  suburbId: number;
  street: string;
  exteriorNumber: string;
  interiorNumber: string;
  addressReference: string;
  fullAddress: string;
  rfc: string;
  razonSocial: string;
  regimenFiscal: string;
  status: string; 
  clientType: string;
  notes: string;
  createdBy: number;
  updatedBy: number;
  deletedBy: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  suburb: Suburb;
  legalName: string | null;
  // cfdiUse: string | null;
  // taxSystem: string | null;
}

export interface Suburb {
  id: number;
  name: string;
  zipCodeId: number;
  zipCode: ZipCode
}

interface ZipCode {
  id: number,
  name: string,
  city: City
};

interface City {
  id: number,
  name: string
}

export interface CustomerFilter {
  id?: number[];
}

export type CusomerRelations = 'suburb.zipCode';

export interface CustomerParams
  extends BasePaginationParams<CustomerFilter, CusomerRelations> {}
