import type { FC } from 'react';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { useCurrencyByIdQuery } from '@/features/currencies/hooks/currencies.query';

type CurrencyFormContainerProps = {
  mode: ModeAction;
  currencyId?: number;
  title: string;
};

export const CurrencyFormContainer: FC<CurrencyFormContainerProps> = ({
  mode,
  currencyId,
  title
}) => {
  const {
    data: currency,
    isLoading: currencyLoading,
    error,
    refetch,
    isRefetching
  } = useCurrencyByIdQuery({
    id: currencyId!,
    options: {},
    enabled: mode !== ModeAction.Create,
    retry: false,
    staleTime: 5 * 60 * 1000
  });

  if (mode === ModeAction.Create) {
    return (
      <DashboardLayoutContainer title={title}>
        {/* <CurrencyForm mode={mode} /> */}
      </DashboardLayoutContainer>
    );
  }

  if (currencyLoading) {
    return (
      <DashboardLayoutContainer title={title}>
        <LoadingScreen isLoading={true} />
      </DashboardLayoutContainer>
    );
  }

  if (error || !currency) {
    const errorMessage = error
      ? 'Error loading currency'
      : 'Currency not found';

    return (
      <DashboardLayoutContainer title={title}>
        {/* <PageNotFound
          message={errorMessage}
          redirectPath='/currencies'
          statusCode={error ? 500 : 404}
          showRetry={true}
          isRetrying={isRefetching}
          onRetry={() => refetch()}
        /> */}
      </DashboardLayoutContainer>
    );
  }

  return (
    <DashboardLayoutContainer title={title}>
      {/* <CurrencyForm mode={mode} currency={currency} /> */}
    </DashboardLayoutContainer>
  );
};
