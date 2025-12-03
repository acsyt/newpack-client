import type {
  Transfer,
  TransferFilter,
  TransferRelations,
  TransferParams
} from './transfer.interface';
import type { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { SharedService } from '../shared/shared.service';

import { apiFetcher } from '@/config/api-fetcher';
import { DataResponse } from '@/interfaces/data-response.interface';

export interface ShipTransferDto {
  source_warehouse_id: number;
  destination_warehouse_id: number;
  notes?: string;
  products: {
    product_id: number;
    quantity: number;
    source_location_id?: number;
    destination_location_id?: number;
    batch_id?: number | null;
  }[];
}

export interface ReceiveTransferDto {
  receiving_notes?: string;
  items: {
    transfer_item_id: number;
    quantity_received: number;
    quantity_missing?: number;
    quantity_damaged?: number;
  }[];
}

export class TransferService extends SharedService {
  static findAllTransfers = async (
    options: TransferParams
  ): Promise<PaginationResponse<Transfer>> => {
    return SharedService.findAll<
      Transfer,
      TransferFilter,
      TransferRelations,
      TransferParams
    >(apiFetcher, '/inventory/transfers', options);
  };

  static findByIdTransfer = async (
    id: number,
    options?: TransferParams
  ): Promise<Transfer> => {
    return SharedService.findOne<
      Transfer,
      TransferFilter,
      TransferRelations,
      TransferParams
    >(apiFetcher, `/inventory/transfers/${id}`, options || {});
  };

  static shipTransfer = async (data: ShipTransferDto): Promise<Transfer> => {
    return SharedService.create<Transfer, ShipTransferDto>(
      apiFetcher,
      '/inventory/movements/transfer',
      data
    );
  };

  static receiveTransfer = async (
    id: number,
    data: ReceiveTransferDto
  ): Promise<Transfer> => {
    const response = await apiFetcher.post<DataResponse<Transfer>>(
      `/inventory/transfers/${id}/receive`,
      data
    );

    return response.data.data;
  };
}
