import type { DataResponse } from '@/domain/interfaces/data-response.interface';
import type { PaginationResponse } from '@/domain/interfaces/pagination-response.interface';
import type {
  UserParams,
  User,
  UserFilter,
  UserRelations
} from '@/domain/interfaces/user.interface';
import type { UserDto } from '@/presentation/schemas/user.schema';

import { SharedService } from './shared.service';

import { ErrorMapper } from '@/config/mappers/error.mapper';
import { getFetcher } from '@/config/utils/get-fetcher.util';

export class UserService extends SharedService {
  static findAllUsers = async (
    options: UserParams
  ): Promise<PaginationResponse<User>> => {
    const fetcher = getFetcher();

    return SharedService.findAll<User, UserFilter, UserRelations, UserParams>(
      fetcher,
      '/users',
      options
    );
  };

  static findUserByIdAction = async (
    id: number,
    options: UserParams
  ): Promise<User> => {
    const fetcher = getFetcher();

    return SharedService.findOne<User, UserFilter, UserRelations, UserParams>(
      fetcher,
      `/users/${id}`,
      options
    );
  };

  static createUser = async (userDto: UserDto): Promise<DataResponse<User>> => {
    const fetcher = getFetcher();

    try {
      const data = await SharedService.create<DataResponse<User>, UserDto>(
        fetcher,
        '/users',
        userDto
      );

      return data;
    } catch (error) {
      ErrorMapper.throwMappedError(error);
    }
  };

  static updateUser = async (
    id: number,
    userDto: UserDto
  ): Promise<DataResponse<User>> => {
    const fetcher = getFetcher();

    try {
      const data = await SharedService.update<DataResponse<User>, UserDto>(
        fetcher,
        `/users/${id}`,
        userDto
      );

      return data;
    } catch (error) {
      ErrorMapper.throwMappedError(error);
    }
  };
}
