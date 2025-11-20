import { useEffect, type FC } from 'react';

import { RouterProvider } from '@tanstack/react-router';

import { useAuthStore } from './presentation/stores/auth.store';
import { router } from './router';

interface MainAppProps {}

export const MainApp: FC<MainAppProps> = ({}) => {
  const authStore = useAuthStore();

  useEffect(() => {
    document.title = window.location.host;
  }, []);

  return (
    <RouterProvider
      router={router}
      context={{
        auth: authStore
      }}
    />
  );
};
