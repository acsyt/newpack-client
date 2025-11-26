import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { throwMappedError } from '@/config/error.mapper';
import { LoginDto } from '@/features/auth/auth.schema';
import { AuthService } from '@/features/auth/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (loginDto: LoginDto) => AuthService.login(loginDto),
    onSuccess: ({ data }) => {
      const { user, token } = data;

      setAuth(user, token);
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      router.navigate({ to: '/' });
    },
    onError: error => {
      throwMappedError(error);
    }
  });
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      router.navigate({ to: '/' });
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    }
  });
};

export const useAuth = () => {
  const authState = useAuthStore();
  const logout = useLogout();
  const permissions = useAuthStore.getState().user?.permissions ?? [];

  return {
    ...authState,
    logout: logout.mutate,
    isLoggingOut: logout.isPending,
    permissions
  };
};
