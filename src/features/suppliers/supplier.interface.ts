import { BasePaginationParams } from "@/interfaces/pagination-response.interface";

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
  status: string;
  notes?: string | null;
  createdBy: number;
  updatedBy: number;
  deletedBy?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  suburb: {
    id: number;
    name: string;
    zipCodeId: number;
  };
};

export interface SupplierFilter {
  id?: number[];
}

export type SupplierRelations = '';

export interface SupplierParams
  extends BasePaginationParams<SupplierFilter, SupplierRelations> {}

