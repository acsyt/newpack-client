import type { FC } from 'react';

import { UserForm } from './UserForm';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { PageNotFound } from '@/components/shared/PageNotFound';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { useUserByIdQuery } from '@/features/users/hooks/users.query';

type UserFormContainerProps = {
  mode: ModeAction;
  userId?: number;
  title: string;
};

export const UserFormContainer: FC<UserFormContainerProps> = ({
  mode,
  userId,
  title
}) => {
  const {
    data: user,
    isLoading: userLoading,
    error,
    refetch,
    isRefetching
  } = useUserByIdQuery({
    id: userId!,
    options: {},
    enabled: mode !== ModeAction.Create,
    retry: false,
    staleTime: 5 * 60 * 1000
  });

  if (userLoading) {
    return (
      <DashboardLayoutContainer title={title}>
        <LoadingScreen isLoading={true} />
      </DashboardLayoutContainer>
    );
  }

  if (error || !user) {
    const errorMessage = error ? 'Error loading user' : 'User not found';

    return (
      <DashboardLayoutContainer title={title}>
        <PageNotFound
          message={errorMessage}
          redirectPath='/users'
          statusCode={error ? 500 : 404}
          showRetry={true}
          isRetrying={isRefetching}
          onRetry={() => refetch()}
        />
      </DashboardLayoutContainer>
    );
  }

  return (
    <DashboardLayoutContainer title={title}>
      <UserForm mode={mode} user={user} />
    </DashboardLayoutContainer>
  );
};
