import type {
  CurrencyParams,
  Currency,
  CurrencyFilter,
  CurrencyRelations
} from '@/features/currencies/currency.interface';
import type { CurrencyDto } from '@/features/currencies/currency.schema';
import type { DataResponse } from '@/interfaces/data-response.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';
import { getErrorMessage } from '@/config/error.mapper';

export class CurrencyService extends SharedService {
  static findAllCurrencies = async (
    options: CurrencyParams
  ): Promise<PaginationResponse<Currency>> => {
    return SharedService.findAll<Currency, CurrencyFilter, CurrencyRelations, CurrencyParams>(
      apiFetcher,
      '/currencies',
      options
    );
  };

  static findCurrencyByIdAction = async (
    id: number,
    options: CurrencyParams
  ): Promise<Currency> => {
    return SharedService.findOne<Currency, CurrencyFilter, CurrencyRelations, CurrencyParams>(
      apiFetcher,
      `/currencies/${id}`,
      options
    );
  };

  static createCurrency = async (currencyDto: CurrencyDto): Promise<DataResponse<Currency>> => {
    try {
      const data = await SharedService.create<DataResponse<Currency>, CurrencyDto>(
        apiFetcher,
        '/currencies',
        currencyDto
      );

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static updateCurrency = async (
    id: number,
    currencyDto: CurrencyDto
  ): Promise<DataResponse<Currency>> => {
    try {
      const data = await SharedService.update<DataResponse<Currency>, CurrencyDto>(
        apiFetcher,
        `/currencies/${id}`,
        currencyDto
      );

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };
}
