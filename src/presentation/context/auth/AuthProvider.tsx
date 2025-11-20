import type { DataResponse } from '@/domain/interfaces/data-response.interface';
import type { SessionUser } from '@/domain/interfaces/session-user.interface';
import type { FC, PropsWithChildren } from 'react';

import { useContext, useEffect } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { AuthContext } from './AuthContext';

import { CustomError } from '@/config/errors/custom.error';
import { ErrorMapper } from '@/config/mappers/error.mapper';
import {
  AuthResponse,
  AuthService
} from '@/infrastructure/services/auth.service';
import { LoadingScreen } from '@/presentation/components/shared/loading-screen/LoadingScreen';
import { getDefaultRouteByUser } from '@/presentation/routes/route.config';
import { LoginDto } from '@/presentation/schemas/auth.schema';
import { useAuthStore } from '@/presentation/stores/auth.store';

export const authKeys = {
  validateUser: () => ['user'] as const
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const setUser = useAuthStore(state => state.setUser);
  const setToken = useAuthStore(state => state.setToken);
  const clearAuth = useAuthStore(state => state.clearAuth);
  const token = useAuthStore(state => state.authToken?.token);
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const queryClient = useQueryClient();

  const userQuery = useQuery<SessionUser>({
    queryKey: authKeys.validateUser(),
    queryFn: () => AuthService.validateUser(),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: false
  });

  const loginMutation = useMutation<
    DataResponse<AuthResponse>,
    CustomError,
    LoginDto
  >({
    mutationFn: loginDto => AuthService.login(loginDto),
    onSuccess: async ({ data }) => {
      setUser(data.user);
      setToken(data.token);

      queryClient.setQueryData(authKeys.validateUser(), data.user);

      const defaultRoute = getDefaultRouteByUser(data.user, data.permissions);

      router.navigate({ to: defaultRoute });
    },
    onError: error => {
      clearAuth();
      ErrorMapper.throwMappedError(error);
    }
  });

  const logoutMutation = useMutation<void, CustomError, void, unknown>({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: authKeys.validateUser() });
      router.invalidate();
    },
    onError: error => {
      ErrorMapper.throwMappedError(error);
    }
  });

  useEffect(() => {
    if (userQuery.data && !userQuery.isError) setUser(userQuery.data);
  }, [userQuery, setUser]);

  const isCheckingAuth = token && !user && userQuery.isLoading;

  if (isCheckingAuth) return <LoadingScreen />;

  return (
    <AuthContext.Provider
      value={{
        loginMutation,
        logoutMutation,
        user,
        isAuthenticated,
        isLoading: userQuery.isLoading,
        userQuery
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error('useAuthContext must be used within an AuthProvider');

  return context;
};
