import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';

import { ErrorMapper } from './config/mappers/error.mapper';
import { AuthState } from './presentation/stores/auth.store';
import { routeTree } from './routeTree.gen';

export const router = (() => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retryDelay: () => 500,
        retry(failureCount, error) {
          const mappedError = ErrorMapper.mapErrorToApiResponse(error);

          if (!mappedError.statusCode || mappedError.statusCode === 401)
            return false;
          if (mappedError.statusCode >= 400 && mappedError.statusCode < 500)
            return false;

          return failureCount < 1;
        },
        staleTime: 1000 * 30 // 30 seconds
      },
      mutations: {
        retry: false
      }
    }
  });

  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: {
      auth: {} as AuthState,
      queryClient
    },
    Wrap: ({ children }) => {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    }
  });
})();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
