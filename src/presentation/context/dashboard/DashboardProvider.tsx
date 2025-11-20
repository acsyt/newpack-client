import type { FC, PropsWithChildren } from 'react';

import { useReducer, useContext, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { AuthContext } from '../auth/AuthContext';
import { authKeys } from '../auth/AuthProvider';

import { DashboardContext } from './DashboardContext';
import { dashboardReducer } from './dashboardReducer';

import { ErrorMapper } from '@/config/mappers/error.mapper';
import { LoadingScreen } from '@/presentation/components/shared/loading-screen/LoadingScreen';
import { useAuthStore } from '@/presentation/stores/auth.store';

export interface DashboardState {}

const DASHBOARD_INITIAL_STATE: DashboardState = {};

export const DashboardProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state] = useReducer(dashboardReducer, DASHBOARD_INITIAL_STATE);

  const { userQuery } = useContext(AuthContext);

  const router = useRouter();
  const clearAuth = useAuthStore(state => state.clearAuth);
  const token = useAuthStore(state => state.authToken?.token);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userQuery.isLoading) return;

    const hasNoToken = !token;
    const hasQueryError = userQuery.isError;
    const hasNoData = !userQuery.data;

    const customError = userQuery.error
      ? ErrorMapper.mapErrorToApiResponse(userQuery.error)
      : null;

    const shouldLogout =
      hasNoToken ||
      hasQueryError ||
      hasNoData ||
      customError?.statusCode === 401 ||
      customError?.statusCode === 404;

    if (shouldLogout) {
      queryClient.removeQueries({ queryKey: authKeys.validateUser() });
      clearAuth();

      router.navigate({ to: '/auth/login', replace: true });
    }
  }, [
    token,
    router,
    clearAuth,
    userQuery.isLoading,
    userQuery.isError,
    userQuery.data,
    userQuery.error,
    queryClient
  ]);

  if (userQuery.isLoading || userQuery.isError || !userQuery.data) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContext.Provider
      value={{
        ...state
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
