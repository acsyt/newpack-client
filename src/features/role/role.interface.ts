import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

export enum RoleEnum {
  Admin = 'admin'
}

export interface Role {
  id: number;
  name: RoleEnum | string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: RolePermission[];
}

export interface RoleFilter {
  id?: number[];
  active?: boolean[];
  name?: string[];
}

export type RoleRelations = '';

export interface PaginationOptionsRole
  extends BasePaginationParams<RoleFilter, RoleRelations> {}

export interface RolePermission {
  id: number;
  created_at: string;
  description: string;
  guard_name: string;
  name: Permission;
  updated_at: string;
}

export interface RolePermissionFilter {}

export type RolePermissionRelations = '';

export interface PaginationOptionsRolePermission
  extends BasePaginationParams<RolePermissionFilter, RolePermissionRelations> {}

export type Permission =
  // Dashboard
  | 'dashboard.index'

  // Users
  | 'users.index'
  | 'users.show'
  | 'users.create'
  | 'users.edit'
  | 'users.change-password'
  | 'users.export'

  // Roles
  | 'roles.index'
  | 'roles.show'
  | 'roles.create'
  | 'roles.edit'
  | 'roles.export'

  // Classes
  | 'classes.index'
  | 'classes.show'
  | 'classes.create'
  | 'classes.edit'
  | 'classes.export'

  // Subclasses
  | 'subclasses.index'
  | 'subclasses.show'
  | 'subclasses.create'
  | 'subclasses.edit'
  | 'subclasses.export'

  // Machines
  | 'machines.index'
  | 'machines.show'
  | 'machines.create'
  | 'machines.edit'
  | 'machines.export'

  // Processes
  | 'processes.index'
  | 'processes.show'
  | 'processes.create'
  | 'processes.edit'
  | 'processes.export'

  // Raw materials
  | 'raw-materials.index'
  | 'raw-materials.show'
  | 'raw-materials.create'
  | 'raw-materials.edit'
  | 'raw-materials.export'

  // Suppliers
  | 'suppliers.index'
  | 'suppliers.show'
  | 'suppliers.create'
  | 'suppliers.edit'
  | 'suppliers.export'

  // Customers
  | 'customers.index'
  | 'customers.show'
  | 'customers.create'
  | 'customers.edit'
  | 'customers.export';
