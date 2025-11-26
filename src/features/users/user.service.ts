import type {
  UserParams,
  User,
  UserFilter,
  UserRelations
} from '@/features/users/user.interface';
import type { UserDto } from '@/features/users/user.schema';
import type { DataResponse } from '@/interfaces/data-response.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';
import { getErrorMessage } from '@/config/error.mapper';

export class UserService extends SharedService {
  static findAllUsers = async (
    options: UserParams
  ): Promise<PaginationResponse<User>> => {
    return SharedService.findAll<User, UserFilter, UserRelations, UserParams>(
      apiFetcher,
      '/users',
      options
    );
  };

  static findUserByIdAction = async (
    id: number,
    options: UserParams
  ): Promise<User> => {
    return SharedService.findOne<User, UserFilter, UserRelations, UserParams>(
      apiFetcher,
      `/users/${id}`,
      options
    );
  };

  static createUser = async (userDto: UserDto): Promise<DataResponse<User>> => {
    try {
      const data = await SharedService.create<DataResponse<User>, UserDto>(
        apiFetcher,
        '/users',
        userDto
      );

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static updateUser = async (
    id: number,
    userDto: UserDto
  ): Promise<DataResponse<User>> => {
    try {
      const data = await SharedService.update<DataResponse<User>, UserDto>(
        apiFetcher,
        `/users/${id}`,
        userDto
      );

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };
}
