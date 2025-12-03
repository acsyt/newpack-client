import { Permission } from '../roles/role.interface';

export interface SessionUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  permissions: Permission[] | null;
  roles: SessionRole[];
  language: string;
}

export enum SessionRole {
  Admin = 'admin'
}
