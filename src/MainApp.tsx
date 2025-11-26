import { useEffect, type FC } from 'react';

import { RouterProvider } from '@tanstack/react-router';

import { router } from './router';
import { useAuthStore } from './stores/auth.store';

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
