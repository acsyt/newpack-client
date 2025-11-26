import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';

import { UserDto } from '../user.schema';
import { UserService } from '../user.service';

import { usersKeys } from './users.query';

import { getErrorMessage } from '@/config/error.mapper';

export const useUsersMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ data, id }: { data: UserDto; id: number | null }) => {
      if (id) return UserService.updateUser(id, data);

      return UserService.createUser(data);
    },
    onSuccess: ({ message, data }) => {
      toast.success(message);
      router.navigate({ to: '/users' });
      queryClient.invalidateQueries({ queryKey: usersKeys.list({}) });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(data.id) });
    },
    onError: error => {
      const message = getErrorMessage(error);

      toast.error(message);
    }
  });
};
