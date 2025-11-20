import type {
  PaginationOptionsRole,
  RolePermission,
  RolePermissionFilter,
  RolePermissionRelations,
  Role,
  RoleFilter,
  RoleRelations,
  PaginationOptionsRolePermission
} from '@/domain/interfaces/role.interface';
import type { RoleDto } from '@/presentation/schemas/role.schema';

import { SharedService } from './shared.service';

import { ErrorMapper } from '@/config/mappers/error.mapper';
import { getFetcher } from '@/config/utils/get-fetcher.util';
import { DataResponse } from '@/domain/interfaces/data-response.interface';
import { PaginationResponse } from '@/domain/interfaces/pagination-response.interface';

export class RoleService extends SharedService {
  static findAllRoles = (options: PaginationOptionsRole) => {
    const fetcher = getFetcher();

    return SharedService.findAll<
      Role,
      RoleFilter,
      RoleRelations,
      PaginationOptionsRole
    >(fetcher, '/roles', options);
  };

  static findRoleById = async (
    id: number,
    options: PaginationOptionsRole
  ): Promise<Role> => {
    const fetcher = getFetcher();

    return SharedService.findOne<
      Role,
      RoleFilter,
      RoleRelations,
      PaginationOptionsRole
    >(fetcher, `/roles/${id}`, options);
  };

  static findAllPermissions = async (): Promise<
    PaginationResponse<RolePermission>
  > => {
    const fetcher = getFetcher();

    return SharedService.findAll<
      RolePermission,
      RolePermissionFilter,
      RolePermissionRelations,
      PaginationOptionsRolePermission
    >(fetcher, '/permissions', { sort: 'order' });
  };

  static createRole = async (
    createRoleDto: RoleDto
  ): Promise<DataResponse<Role>> => {
    const fetcher = getFetcher();

    return fetcher
      .post<DataResponse<Role>>('/roles', createRoleDto)
      .then(response => response.data)
      .catch(error => ErrorMapper.throwMappedError(error));
  };

  static updateRole = async (
    roleId: number,
    updateRoleDto: RoleDto
  ): Promise<DataResponse<Role>> => {
    const fetcher = getFetcher();

    return fetcher
      .put<DataResponse<Role>>(`/roles/${roleId}`, updateRoleDto)
      .then(response => response.data)
      .catch(error => ErrorMapper.throwMappedError(error));
  };
}
