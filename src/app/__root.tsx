import type { AuthState } from '@/presentation/stores/auth.store';
import type { QueryClient } from '@tanstack/react-query';

import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { PageNotFound } from '@/presentation/components/shared/not-found/PageNotFound';
import { RootProvider } from '@/presentation/components/theme/RootProvider';
import { customTheme } from '@/presentation/theme/custom.theme';

type Context = {
  auth: AuthState;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<Context>()({
  component: RootComponent,
  notFoundComponent: () => <PageNotFound />
});

function RootComponent() {
  return (
    <>
      <RootProvider theme={customTheme}>
        <Outlet />
      </RootProvider>
      <TanStackRouterDevtools position='bottom-right' />
    </>
  );
}
