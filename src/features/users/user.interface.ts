import { BasePaginationParams } from '../../interfaces/pagination-response.interface';
import { Role } from '../role/role.interface';

export interface User {
  id: number;
  name: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  userType: string;
  active: boolean;
  roles: Role[];
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
