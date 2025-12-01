import { Permission } from '../roles/role.interface';

import { apiFetcher } from '@/config/api-fetcher';
import { getErrorMessage } from '@/config/error.mapper';
import { LoginDto } from '@/features/auth/auth.schema';
import { SessionUser } from '@/features/auth/session-user.interface';
import { DataResponse } from '@/interfaces/data-response.interface';

export interface ForgotPasswordDto {
  email: string;
}

export interface AuthResponse {
  token: AuthToken;
  user: SessionUser;
  permissions: Permission[];
}

export interface AuthToken {
  token: string;
  tokenType: string;
  expiresAt: string;
}

export class AuthService {
  static login = async (
    loginDto: LoginDto
  ): Promise<DataResponse<AuthResponse>> => {
    try {
      const { data } = await apiFetcher.post<DataResponse<AuthResponse>>(
        '/auth/login',
        loginDto
      );

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static validateUser = async (): Promise<SessionUser> => {
    try {
      const { data } =
        await apiFetcher.get<DataResponse<SessionUser>>('/auth/user');

      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static logout = async (): Promise<void> => {
    try {
      await apiFetcher.post('/auth/logout');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static forgotPassword = async (
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<DataResponse<boolean>> => {
    try {
      const { data } = await apiFetcher.post<DataResponse<boolean>>(
        '/auth/forgot-password',
        forgotPasswordDto
      );

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };
}
