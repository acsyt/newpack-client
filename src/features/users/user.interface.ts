import { BasePaginationParams } from '../../interfaces/pagination-response.interface';

export interface User {
  id: number;
  name: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  userType: string;
  active: boolean;
  roles: string[];
  updatedAt: string;
  createdAt: string;
  recoveryAt: string;
  lastLoginAt: string;
}

export interface UserFilter {
  id?: number[];
}

export type UserRelations = 'roles';

export interface UserParams
  extends BasePaginationParams<UserFilter, UserRelations> {}
