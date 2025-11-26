import type { SessionUser } from '../session-user.interface';
import type { UseQueryResult } from '@tanstack/react-query';

import { createContext } from 'react';

export interface AuthContextValue {
  userQuery: UseQueryResult<SessionUser, Error>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
