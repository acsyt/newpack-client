'use client';

import type { FC } from 'react';

import { useMemo } from 'react';

import { useRoleQuery, usePermissions } from '../../hooks/roles.query';

import { RoleForm } from './RoleForm';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { PageNotFound } from '@/components/shared/PageNotFound';
import { ModeAction } from '@/config/enums/mode-action.enum';

type RoleFormContainerProps =
  | { mode: ModeAction.Create }
  | {
      mode: Exclude<ModeAction, ModeAction.Create>;
      id: number;
    };

export const RoleFormContainer: FC<RoleFormContainerProps> = props => {
  const { mode } = props;

  const roleId = 'id' in props ? props.id : null;

  const {
    data: role,
    isLoading: isLoadingRole,
    error,
    refetch,
    isRefetching
  } = useRoleQuery({
    id: roleId!,
    enabled: mode !== ModeAction.Create,
    retry: false,
    staleTime: 5 * 60 * 1000,
    options: {}
  });

  const title = useMemo(() => {
    if (mode === ModeAction.Create) return 'Crear Rol';
    if (role) {
      if (mode === ModeAction.Edit) return `Editar Rol ${role.name}`;

      return `Detalles del Rol ${role.name}`;
    }
  }, [mode, role]);

  const { data: permissionsData, isLoading: isLoadingPermissions } =
    usePermissions({});

  const permissions = useMemo(
    () => permissionsData?.data ?? [],
    [permissionsData]
  );

  if (isLoadingRole || isLoadingPermissions)
    return <LoadingScreen isLoading={isLoadingRole || isLoadingPermissions} />;

  if (mode === ModeAction.Create)
    return (
      <DashboardLayoutContainer title={title}>
        <RoleForm mode={ModeAction.Create} permissions={permissions} />
      </DashboardLayoutContainer>
    );

  if (error || !role) {
    return (
      <DashboardLayoutContainer title={title}>
        <PageNotFound
          message={'No se encontró el rol'}
          redirectPath='/roles'
          statusCode={401}
          showRetry={true}
          isRetrying={isRefetching}
          onRetry={() => refetch()}
        />
      </DashboardLayoutContainer>
    );
  }

  return (
    <DashboardLayoutContainer>
      <RoleForm mode={mode} role={role} permissions={permissions} />
    </DashboardLayoutContainer>
  );
};
