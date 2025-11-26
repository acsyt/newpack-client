import type { FC, PropsWithChildren } from 'react';

import { useContext, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { AuthContext } from '@/features/auth/context/AuthContext';
import { authKeys } from '@/features/auth/hooks/queries';
import { useAuthStore } from '@/stores/auth.store';

export const DashboardProvider: FC<PropsWithChildren> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('DashboardProvider must be used within AuthProvider');
  }

  const { userQuery } = authContext;
  const router = useRouter();
  const queryClient = useQueryClient();

  const token = useAuthStore(state => state.authToken?.token);
  const setUser = useAuthStore(state => state.setUser);
  const clearAuth = useAuthStore(state => state.clearAuth);

  useEffect(() => {
    if (userQuery.isLoading) return;

    const hasNoToken = !token;
    const hasQueryError = userQuery.isError;
    const hasNoData = !userQuery.data;

    const error = userQuery.error;
    const is401or404 =
      error?.message?.includes('401') || error?.message?.includes('404');

    const shouldLogout =
      hasNoToken ||
      (hasQueryError && is401or404) ||
      (hasQueryError && hasNoData);

    if (shouldLogout) {
      queryClient.removeQueries({ queryKey: authKeys.all });
      clearAuth();
      router.navigate({ to: '/auth/login', replace: true });

      return;
    }

    if (userQuery.data && !hasQueryError) {
      setUser(userQuery.data);
    }
  }, [
    token,
    userQuery.isLoading,
    userQuery.isError,
    userQuery.data,
    userQuery.error,
    router,
    setUser,
    clearAuth,
    queryClient
  ]);

  if (userQuery.isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent' />
          <p className='mt-2 text-sm text-gray-500'>Validando sesión...</p>
        </div>
      </div>
    );
  }

  if (userQuery.isError || !userQuery.data || !token) return null;

  return <>{children}</>;
};
