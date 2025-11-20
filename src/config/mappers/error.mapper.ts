import { CustomError } from "@/config/errors/custom.error";
import { ErrorResponse } from "@/domain/interfaces/error-response.interface";

import { AxiosError } from "axios";

export class ErrorMapper {
  static mapErrorToApiResponse(error: any): ErrorResponse {
    if (error instanceof AxiosError) {
      return {
        message: error.response?.data.message || "Ocurrió un error desconocido",
        errors: error.response?.data.errors || {},
        statusCode: error.response?.status || 500,
      };
    } else if (error instanceof CustomError) {
      return {
        message: error.message,
        errors: error.errors,
        statusCode: error.statusCode,
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        errors: {},
        statusCode: 500,
      };
    } else if (typeof error === "object" && error !== null) {
      return {
        message: error.message || "Ocurrió un error desconocido",
        errors: error.errors || {},
        statusCode: error.statusCode || 500,
      };
    }

    return {
      message: "Ocurrió un error desconocido",
      errors: {},
      statusCode: 500,
    };
  }

  static throwMappedError(error: any): never {
    const mappedError = this.mapErrorToApiResponse(error);
    throw new CustomError(
      mappedError.message,
      mappedError.errors,
      mappedError.statusCode,
    );
  }

  static throwCustomError(
    message: string,
    errors: Record<string, string[]> = {},
    statusCode = 500,
  ): never {
    throw new CustomError(message, errors, statusCode);
  }
}
