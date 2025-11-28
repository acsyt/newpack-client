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
}


export interface CustomerFilter {
  id?: number[];
}

export type CusomerRelations = '';

export interface CustomerParams
  extends BasePaginationParams<CustomerFilter, CusomerRelations> {}
