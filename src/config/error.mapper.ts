import type { ErrorResponse } from '@/interfaces/error-response.interface';

import { AxiosError } from 'axios';

import { CustomError } from './custom.error';

export interface CustomErrorData {
  message: string;
  errors: Record<string, string[]>;
  statusCode: number;
  name: string;
}

export function createCustomError(
  message: string,
  errors: Record<string, string[]> = {},
  statusCode = 400
): CustomErrorData & Error {
  const error = new Error(message) as CustomErrorData & Error;

  error.name = message;
  error.errors = errors;
  error.statusCode = statusCode;

  return error;
}

export function isCustomError(error: any): error is CustomErrorData & Error {
  return (
    error instanceof Error &&
    'errors' in error &&
    'statusCode' in error &&
    typeof error.errors === 'object' &&
    typeof error.statusCode === 'number'
  );
}

export function mapErrorToApiResponse(error: any): ErrorResponse {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data.message || 'Ocurrió un error desconocido',
      errors: error.response?.data.errors || {},
      statusCode: error.response?.status || 500
    };
  } else if (isCustomError(error)) {
    return {
      message: error.message,
      errors: error.errors,
      statusCode: error.statusCode
    };
  } else if (error instanceof Error) {
    return {
      message: error.message,
      errors: {},
      statusCode: 500
    };
  } else if (typeof error === 'object' && error !== null) {
    return {
      message: error.message || 'Ocurrió un error desconocido',
      errors: error.errors || {},
      statusCode: error.statusCode || 500
    };
  }

  return {
    message: 'Ocurrió un error desconocido',
    errors: {},
    statusCode: 500
  };
}

export function throwMappedError(error: any): never {
  const mappedError = mapErrorToApiResponse(error);

  throw createCustomError(
    mappedError.message,
    mappedError.errors,
    mappedError.statusCode
  );
}

export function throwCustomError(
  message: string,
  errors: Record<string, string[]> = {},
  statusCode = 500
): never {
  throw createCustomError(message, errors, statusCode);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || 'Error al procesar la solicitud';
  }
  if (isCustomError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado';
}

export class ErrorMapper {
  static mapErrorToApiResponse(error: any): ErrorResponse {
    if (error instanceof AxiosError) {
      return {
        message: error.response?.data.message || 'Ocurrió un error desconocido',
        errors: error.response?.data.errors || {},
        statusCode: error.response?.status || 500
      };
    } else if (error instanceof CustomError) {
      return {
        message: error.message,
        errors: error.errors,
        statusCode: error.statusCode
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        errors: {},
        statusCode: 500
      };
    } else if (typeof error === 'object' && error !== null) {
      return {
        message: error.message || 'Ocurrió un error desconocido',
        errors: error.errors || {},
        statusCode: error.statusCode || 500
      };
    }

    return {
      message: 'Ocurrió un error desconocido',
      errors: {},
      statusCode: 500
    };
  }

  static throwMappedError(error: any): never {
    const mappedError = this.mapErrorToApiResponse(error);

    throw new CustomError(
      mappedError.message,
      mappedError.errors,
      mappedError.statusCode
    );
  }

  static throwCustomError(
    message: string,
    errors: Record<string, string[]> = {},
    statusCode = 500
  ): never {
    throw new CustomError(message, errors, statusCode);
  }
}
