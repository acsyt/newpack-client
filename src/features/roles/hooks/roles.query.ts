import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { PaginationOptionsRole, Role, RolePermission } from '../role.interface';
import { RoleService } from '../role.service';

import { PaginationResponse } from '@/interfaces/pagination-response.interface';

export const rolesKeys = {
  all: () => ['roles'],
  list: (params?: PaginationOptionsRole) => [
    ...rolesKeys.all(),
    'list',
    params
  ],
  detail: (id: number) => [...rolesKeys.all(), 'detail', id]
} as const;

const permissionsKeys = {
  all: () => ['permissions'],
  list: () => [...permissionsKeys.all(), 'list']
} as const;

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<Role>>,
    'queryKey' | 'queryFn'
  > {
  options: PaginationOptionsRole;
}

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

export const useRoleQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: RoleQueryOptionsById) => {
  return useQuery({
    queryKey: rolesKeys.detail(id),
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
    queryKey: permissionsKeys.list(),
    ...rest
  });
};
