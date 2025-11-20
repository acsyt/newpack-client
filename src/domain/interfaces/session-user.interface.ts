import { Permission } from "./role.interface";

export interface SessionUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  permissions: Permission[] | null;
  roles: SessionRole[];
  language: string;
  userType: SessionUserType;
}

export enum SessionRole {
  Admin = "admin",
}

export enum SessionUserType {
  CentralUser = "central-user",
  TenantUser = "tenant-user",
}
