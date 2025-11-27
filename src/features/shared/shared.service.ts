import { AxiosInstance } from 'axios';

import {
  INITIAL_PAGE,
  INITIAL_PAGE_SIZE
} from '@/config/constants/app.constants';
import { getErrorMessage } from '@/config/error.mapper';
import {
  BasePaginationParams,
  PaginationResponse
} from '@/interfaces/pagination-response.interface';

export class SharedService {
  static createQueryParams = <J = Record<string, any>, F = string>(
    options: BasePaginationParams<J, F>
  ): Record<string, any> => {
    const {
      filter = {},
      include = [],
      page = INITIAL_PAGE,
      per_page = INITIAL_PAGE_SIZE,
      sort = '',
      has_pagination = true
    } = options;
    const newFilters = SharedService.transformFiltersToQueryParams(
      filter as Record<string, any>
    );

    const queryParams = {
      ...newFilters,
      ...(include && include.length > 0 && { include: include.join(',') }),
      ...(page ? { page } : {}),
      ...(per_page ? { per_page } : {}),
      ...(sort ? { sort } : {}),
      ...(has_pagination !== undefined && { has_pagination })
    };

    return queryParams;
  };

  static findAll = async <
    TData,
    TFilters,
    TRelations,
    TOptions extends BasePaginationParams<TFilters, TRelations>
  >(
    fetcher: AxiosInstance,
    url: string,
    options: TOptions
  ): Promise<PaginationResponse<TData>> => {
    try {
      const queryParams = this.createQueryParams(options);
      const response = await fetcher.get<PaginationResponse<TData>>(url, {
        params: queryParams
      });

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static findOne = async <
    TData,
    TFilters,
    TRelations,
    TOptions extends BasePaginationParams<TFilters, TRelations>
  >(
    fetcher: AxiosInstance,
    url: string,
    options: TOptions
  ): Promise<TData> => {
    try {
      const queryParams = this.createQueryParams(options);
      const response = await fetcher.get<TData>(url, {
        params: queryParams
      });

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static create = async <TResponse, TRequest>(
    fetcher: AxiosInstance,
    url: string,
    data: TRequest | FormData,
    module?: string,
    action?: string
  ): Promise<TResponse> => {
    try {
      const headersRules = {
        ...(module && { 'X-Module': module }),
        ...(action && { 'X-Action': action })
      };
      const isFormData = data instanceof FormData;

      const response = await fetcher.post<TResponse>(url, data, {
        headers: isFormData
          ? { 'Content-Type': 'multipart/form-data', ...headersRules }
          : { ...headersRules }
      });

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static update = async <TResponse, TRequest>(
    fetcher: AxiosInstance,
    url: string,
    data: TRequest | FormData
  ): Promise<TResponse> => {
    try {
      const isFormData = data instanceof FormData;

      if (isFormData) {
        data.append('_method', 'PUT');
        const response = await fetcher.post<TResponse>(url, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data;
      } else {
        const response = await fetcher.patch<TResponse>(url, data);

        return response.data;
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static download = async <TResponse>(
    fetcher: AxiosInstance,
    url: string,
    options: any
  ): Promise<TResponse> => {
    const queryParams = SharedService.createQueryParams(options);

    try {
      const { data } = await fetcher.get<TResponse>(url, {
        params: queryParams,
        responseType: 'blob'
      });

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };
  static updatePreview = async <Blob, TRequest>(
    fetcher: AxiosInstance,
    url: string,
    payload: TRequest
  ): Promise<Blob> => {
    try {
      const { data } = await fetcher.post<Blob>(url, payload, {
        responseType: 'blob'
      });

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static getPreview = async <Blob, TRequest>(
    fetcher: AxiosInstance,
    url: string,
    payload: TRequest
  ): Promise<Blob> => {
    try {
      const { data } = await fetcher.get<Blob>(url, {
        params: payload,
        responseType: 'blob'
      });

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static transformFiltersToQueryParams = <
    T extends Record<string, string | number | string[] | number[] | undefined>
  >(
    filters: T | undefined
  ): Record<string, string> => {
    return Object.entries(filters ?? {}).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value === undefined || value === null || value === '') return acc;

        if (Array.isArray(value) && value.length === 0) return acc;

        acc[`filter[${key}]`] = Array.isArray(value)
          ? value.join(',')
          : String(value);

        return acc;
      },
      {}
    );
  };
}
