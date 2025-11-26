import type { UserParams, User } from '@/features/users/user.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';
import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { UserService } from '@/features/users/user.service';

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<User>>,
    'queryKey' | 'queryFn'
  > {
  options: UserParams;
}

export const usersKeys = {
  all: () => ['users'] as const,
  list: (params?: UserParams) => [...usersKeys.all(), 'list', params] as const,
  detail: (id: number) => [...usersKeys.all(), 'detail', id] as const
};

export const useUsersQuery = ({ options, ...rest }: QueryOptions) => {
  return useQuery({
    queryKey: usersKeys.list(options),
    queryFn: () => UserService.findAllUsers(options),
    ...rest
  });
};

interface UserQueryOptionsById
  extends Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'> {
  id: number;
  options: UserParams;
}

export const useUserByIdQuery = ({
  id,
  enabled = true,
  options,
  ...rest
}: UserQueryOptionsById) => {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => UserService.findUserByIdAction(id, options),
    enabled: enabled && id > 0,
    ...rest
  });
};
