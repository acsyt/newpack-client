import { useEffect, type FC } from 'react';

import { CustomerForm } from '@/features/customers/components/CustomerForm';
import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { PageNotFound } from '@/components/shared/PageNotFound';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { useCustomerByIdQuery } from '@/features/customers/hook/customer.query';

type CustomerFormContainerProps = {
  mode: ModeAction;
  customerId?: number;
  title: string;
};

export const CustomerFormContainer: FC<CustomerFormContainerProps> = ({ mode, customerId, title }) => {
  const { data: customer,isLoading: customerLoading, error, refetch, isRefetching } = useCustomerByIdQuery({
    id: customerId!,
    options: {include: ['suburb.zipCode']},
    enabled: mode !== ModeAction.Create,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  
  if (mode === ModeAction.Create) {
    return (
      <DashboardLayoutContainer title={title}>
        <CustomerForm mode={mode} />
      </DashboardLayoutContainer>
    );
  };

  if (customerLoading) {
    return (
      <DashboardLayoutContainer title={title}>
        <LoadingScreen isLoading={true} />
      </DashboardLayoutContainer>
    );
  };

  if (error || !customer) {
    const errorMessage = error ? 'Error loading customer' : 'Customer not found';

    return (
      <DashboardLayoutContainer title={title}>
        <PageNotFound
          message={errorMessage}
          redirectPath='/customers'
          statusCode={error ? 500 : 404}
          showRetry={true}
          isRetrying={isRefetching}
          onRetry={() => refetch()}
        />
      </DashboardLayoutContainer>
    );
  };

  return (
    <DashboardLayoutContainer title={title}>
      <CustomerForm mode={mode} customer={customer} />
    </DashboardLayoutContainer>
  );
};
