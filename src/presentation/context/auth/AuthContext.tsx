import { createContext } from 'react';

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

import { CustomError } from '@/config/errors/custom.error';
import { DataResponse } from '@/domain/interfaces/data-response.interface';
import { SessionUser } from '@/domain/interfaces/session-user.interface';
import { AuthResponse } from '@/infrastructure/services/auth.service';
import { LoginDto } from '@/presentation/schemas/auth.schema';

export interface AuthContextProps {
  loginMutation: UseMutationResult<
    DataResponse<AuthResponse>,
    CustomError,
    LoginDto,
    unknown
  >;
  logoutMutation: UseMutationResult<void, CustomError, void, unknown>;
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userQuery: UseQueryResult<SessionUser>;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);
