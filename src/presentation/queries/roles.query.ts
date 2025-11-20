import type { PaginationResponse } from '@/domain/interfaces/pagination-response.interface';
import type {
  PaginationOptionsRole,
  Role,
  RolePermission
} from '@/domain/interfaces/role.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { RoleService } from '@/infrastructure/services/role.service';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<Role>>,
    'queryKey' | 'queryFn'
  > {
  options: PaginationOptionsRole;
}

export const rolesKeys = {
  all: () => ['roles'] as const,
  list: (params?: PaginationOptionsRole) =>
    [...rolesKeys.all(), 'list', params] as const,
  detail: (id: number) => [...rolesKeys.all(), 'detail', id] as const
};

export const useRolesQuery = ({ options, ...rest }: QueryOptions) => {
  return useQuery({
    queryKey: rolesKeys.list(options),
    queryFn: () => RoleService.findAllRoles(options),
    ...rest
  });
};

interface RoleQueryOptionsById
  extends Omit<UseQueryOptions<Role>, 'queryKey' | 'queryFn'> {
  id: number;
  options: PaginationOptionsRole;
}

export const roleKey = (id: number) => ['role', id];

export const useRoleQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: RoleQueryOptionsById) => {
  return useQuery({
    queryKey: roleKey(id),
    queryFn: () => RoleService.findRoleById(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};

interface PermissionQueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<RolePermission>>,
    'queryKey' | 'queryFn'
  > {}

export const usePermissions = (rest: PermissionQueryOptions) => {
  return useQuery({
    queryFn: () => RoleService.findAllPermissions(),
    queryKey: ['permissions'],
    ...rest
  });
};
