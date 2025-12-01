import type { FC } from 'react';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { PageNotFound } from '@/components/shared/PageNotFound';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { SupplierForm } from '@/features/suppliers/components/SupplierForm';
import { useSupplierByIdQuery } from '@/features/suppliers/hooks/supplier.query';

type SuppliersFormContainerProps = {
  mode: ModeAction;
  supplierId?: number;
  title: string;
};

export const SuppliersFormContainer: FC<SuppliersFormContainerProps> = ({
  mode,
  supplierId,
  title
}) => {
  const {
    data: supplier,
    isLoading: supplierLoading,
    error,
    refetch,
    isRefetching
  } = useSupplierByIdQuery({
    id: supplierId!,
    options: {},
    enabled: mode !== ModeAction.Create,
    retry: false,
    staleTime: 5 * 60 * 1000
  });

  if (mode === ModeAction.Create) {
    return (
      <DashboardLayoutContainer title={title}>
        <SupplierForm mode={mode} />
      </DashboardLayoutContainer>
    );
  }

  if (supplierLoading) {
    return (
      <DashboardLayoutContainer title={title}>
        <LoadingScreen isLoading={true} />
      </DashboardLayoutContainer>
    );
  }

  if (error || !supplier) {
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
      <SupplierForm mode={mode} supplier={supplier} />
    </DashboardLayoutContainer>
  );
};
