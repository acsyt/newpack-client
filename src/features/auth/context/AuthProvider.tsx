import type { FC, PropsWithChildren } from 'react';

import { AuthContext } from './AuthContext';

import { useValidateUser } from '@/features/auth/hooks/queries';
import { useAuthStore } from '@/stores/auth.store';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const token = useAuthStore(state => state.authToken?.token);

  const userQuery = useValidateUser(!!token);

  return (
    <AuthContext.Provider value={{ userQuery }}>
      {children}
    </AuthContext.Provider>
  );
};
