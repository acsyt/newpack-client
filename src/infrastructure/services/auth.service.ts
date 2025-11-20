import { ErrorMapper } from '@/config/mappers/error.mapper';
import { getFetcher } from '@/config/utils/get-fetcher.util';
import { DataResponse } from '@/domain/interfaces/data-response.interface';
import { Permission } from '@/domain/interfaces/role.interface';
import { SessionUser } from '@/domain/interfaces/session-user.interface';
import { LoginDto } from '@/presentation/schemas/auth.schema';

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

export interface BootstrapResponse {
  user: SessionUser | null;
  languageCodes: string[];
  permissions: Permission[];
}

export class AuthService {
  static login = async (
    loginDto: LoginDto
  ): Promise<DataResponse<AuthResponse>> => {
    const fetcher = getFetcher();

    try {
      const { data } = await fetcher.post<DataResponse<AuthResponse>>(
        '/auth/login',
        loginDto
      );

      return data;
    } catch (error) {
      ErrorMapper.throwMappedError(error);
    }
  };

  static validateUser = async (): Promise<SessionUser> => {
    const fetcher = getFetcher();

    try {
      const { data } = await fetcher.get<SessionUser>('/auth/user');

      return data;
    } catch (error) {
      ErrorMapper.throwMappedError(error);
    }
  };

  static bootstrap = async (): Promise<BootstrapResponse> => {
    const fetcher = getFetcher();

    try {
      const { data } = await fetcher.get<BootstrapResponse>('/auth/bootstrap');

      return data;
    } catch (error) {
      ErrorMapper.throwMappedError(error);
    }
  };

  static logout = async (): Promise<void> => {
    const fetcher = getFetcher();

    try {
      await fetcher.post('/auth/logout');
    } catch (error) {
      ErrorMapper.throwMappedError(error);
    }
  };

  static forgotPassword = async (
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<DataResponse<boolean>> => {
    const fetcher = getFetcher();

    try {
      const { data } = await fetcher.post<DataResponse<boolean>>(
        '/auth/forgot-password',
        forgotPasswordDto
      );

      return data;
    } catch (error) {
      ErrorMapper.throwMappedError(error);
    }
  };
}
