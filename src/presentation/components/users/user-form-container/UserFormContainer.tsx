import type { FC } from 'react';

import { useMemo } from 'react';

import { UserForm } from './UserForm';

import { ModeAction } from '@/config/enums/mode-action.enum';
import { Role } from '@/domain/interfaces/role.interface';
import { DashboardLayoutContainer } from '@/presentation/components/layouts/dashboard/DashboardLayoutContainer';
import { LoadingScreen } from '@/presentation/components/shared/loading-screen/LoadingScreen';
import { PageNotFound } from '@/presentation/components/shared/not-found/PageNotFound';
import { useRolesQuery } from '@/presentation/queries/roles.query';
import { useUserByIdQuery } from '@/presentation/queries/users.query';

type UserFormContainerProps =
  | {
      mode: ModeAction.Create;
    }
  | {
      mode: Exclude<ModeAction, ModeAction.Create>;
      id: number;
    };

export const UserFormContainer: FC<UserFormContainerProps> = ({
  mode,
  ...rest
}) => {
  const userId = 'id' in rest ? rest.id : null;

  const rolesQuery = useRolesQuery({
    options: {
      has_pagination: false,
      filter: {
        active: [true]
      }
    }
  });
  const roles = useMemo<Role[]>(
    () => rolesQuery.data?.data ?? [],
    [rolesQuery.data]
  );

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

  const title = useMemo(() => {
    if (mode === ModeAction.Create) return 'Create user';
    if (user) {
      if (mode === ModeAction.Edit) return `Edit user: ${user.name}`;
    }
  }, [mode, user]);

  if (mode === ModeAction.Create) {
    return (
      <DashboardLayoutContainer title={title}>
        <UserForm mode={mode} roles={roles} />
      </DashboardLayoutContainer>
    );
  }

  if (rolesQuery.isLoading || (userLoading && !user))
    return (
      <DashboardLayoutContainer title={title}>
        <LoadingScreen isLoading={true} />
      </DashboardLayoutContainer>
    );

  if (error || !user) {
    return (
      <DashboardLayoutContainer title={title}>
        <PageNotFound
          message={`User not found`}
          redirectPath='/users'
          statusCode={401}
          showRetry={true}
          isRetrying={isRefetching}
          onRetry={() => refetch()}
        />
      </DashboardLayoutContainer>
    );
  }

  return (
    <DashboardLayoutContainer title={title}>
      <UserForm mode={mode} user={user} roles={roles} />
    </DashboardLayoutContainer>
  );
};
