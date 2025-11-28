import type {
  Customer,
  CustomerFilter,
  CustomerParams,
  CusomerRelations
} from '@/features/customers/customer.interface';
//! CAMBIAR ESTA PROP PARA QUE ESTE TOMANDO LAS VALIDACIONES DEL SCHEMA DE CUSTOMER
import type { UserDto } from '@/features/users/user.schema';
import type { DataResponse } from '@/interfaces/data-response.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';
import { getErrorMessage } from '@/config/error.mapper';
import { CustomerDto } from './customer.schema';

export class CustomerService extends SharedService {
  static findAllCustomers = async (
    options: CustomerParams
  ): Promise<PaginationResponse<Customer>> => {
    //FIXME: Movere esta prop cuando se tengan los filtros por id en este punto 
    const props = {...options};
    delete props.sort;
    return SharedService.findAll<Customer, CustomerFilter, CusomerRelations, CustomerParams>(
      apiFetcher,
      '/customers',
      options
    );
  };

  static findCustomerByIdAction = async (
    id: number,
    options: CustomerParams
  ): Promise<Customer> => {
    return SharedService.findOne<Customer, CustomerFilter, CusomerRelations, CustomerParams>(
      apiFetcher,
      `/customers/${id}`,
      options
    );
  };

  static createCustomer = async (CustomerDto: CustomerDto): Promise<DataResponse<Customer>> => {
    try {
      const data = await SharedService.create<DataResponse<Customer>, CustomerDto>(
        apiFetcher,
        '/customers',
        CustomerDto
      );

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  static updateCustomer = async (
    id: number,
    CustomerDto: CustomerDto
  ): Promise<DataResponse<Customer>> => {
    try {
      const data = await SharedService.update<DataResponse<Customer>, CustomerDto>(
        apiFetcher,
        `/customers/${id}`,
        CustomerDto
      );

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };
}
