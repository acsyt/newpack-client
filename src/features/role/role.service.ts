import type {
    Role,
    RoleFilter,
    PaginationOptionsRolePermission,
    RolePermissionRelations
    

} from '@/features/role/role.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';

export class RoleService extends SharedService {
  static findAllRoles = async (
    options: PaginationOptionsRolePermission
  ): Promise<PaginationResponse<Role>> => {
    return SharedService.findAll<Role, RoleFilter, RolePermissionRelations, PaginationOptionsRolePermission>(
      apiFetcher,
      '/roles',
      options
    );
  };

}
