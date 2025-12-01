import { SharedService } from '../shared/shared.service';

import {
  PaginationOptionsRole,
  Role,
  RoleFilter,
  RoleRelations,
  RolePermission,
  RolePermissionFilter,
  RolePermissionRelations,
  PaginationOptionsRolePermission
} from './role.interface';
import { RoleDto } from './role.schema';

import { apiFetcher } from '@/config/api-fetcher';
import { ErrorMapper } from '@/config/error.mapper';
import { DataResponse } from '@/interfaces/data-response.interface';
import { PaginationResponse } from '@/interfaces/pagination-response.interface';

export class RoleService extends SharedService {
  static findAllRoles = async (
    options: PaginationOptionsRole
  ): Promise<PaginationResponse<Role>> => {
    return SharedService.findAll<
      Role,
      RoleFilter,
      RoleRelations,
      PaginationOptionsRole
    >(apiFetcher, '/roles', options);
  };

  static findRoleById = async (
    id: number,
    options: PaginationOptionsRole
  ): Promise<Role> => {
    return SharedService.findOne<
      Role,
      RoleFilter,
      RoleRelations,
      PaginationOptionsRole
    >(apiFetcher, `/roles/${id}`, options);
  };

  static findAllPermissions = async (): Promise<
    PaginationResponse<RolePermission>
  > => {
    return SharedService.findAll<
      RolePermission,
      RolePermissionFilter,
      RolePermissionRelations,
      PaginationOptionsRolePermission
    >(apiFetcher, '/permissions', { sort: 'order' });
  };

  static createRole = async (
    createRoleDto: RoleDto
  ): Promise<DataResponse<Role>> => {
    try {
      return await SharedService.create<DataResponse<Role>, RoleDto>(
        apiFetcher,
        '/roles',
        createRoleDto
      );
    } catch (error) {
      ErrorMapper.throwMappedError(error);
    }
  };

  static updateRoleAction = async (
    roleId: number,
    updateRoleDto: RoleDto
  ): Promise<DataResponse<Role>> => {
    try {
      return await SharedService.update<DataResponse<Role>, RoleDto>(
        apiFetcher,
        `/roles/${roleId}`,
        updateRoleDto
      );
    } catch (error) {
      ErrorMapper.throwMappedError(error);
    }
  };
}
