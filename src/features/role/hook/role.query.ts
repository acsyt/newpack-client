import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { Role, PaginationOptionsRolePermission } from '@/features/role/role.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { RoleService } from '@/features/role/role.service';


interface QueryOptions extends Omit<UseQueryOptions<PaginationResponse<Role>>,'queryKey' | 'queryFn'> {
  options: PaginationOptionsRolePermission;
};

export const rolesKeys = {
  all: () => ['roles'],
  list: (params?: PaginationOptionsRolePermission) => [...rolesKeys.all(), 'list', params],
  detail: (id: number) => [...rolesKeys.all(), 'detail', id]
} as const;

export const useRolesQuery = ({ options, ...rest }: QueryOptions) => {
  return useQuery({
    queryKey: rolesKeys.list(options),
    queryFn: () => RoleService.findAllRoles(options),
    ...rest
  });
};

