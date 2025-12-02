import type { Transfer, TransferParams } from '../transfer.interface';
import type { ReceiveTransferDto, ShipTransferDto } from '../transfer.service';

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';

import { TransferService } from '../transfer.service';

import { PaginationResponse } from '@/interfaces/pagination-response.interface';

const TRANSFER_KEYS = {
  all: ['transfers'] as const,
  lists: () => [...TRANSFER_KEYS.all, 'list'] as const,
  list: (params: TransferParams) => [...TRANSFER_KEYS.lists(), params] as const,
  details: () => [...TRANSFER_KEYS.all, 'detail'] as const,
  detail: (id: number | string, params?: TransferParams) =>
    [...TRANSFER_KEYS.details(), id, params] as const
};

interface QueryOptions
  extends Omit<
    UseQueryOptions<PaginationResponse<Transfer>>,
    'queryKey' | 'queryFn'
  > {
  options: TransferParams;
}

export const useTransfersQuery = ({ options, ...rest }: QueryOptions) => {
  return useQuery({
    queryKey: TRANSFER_KEYS.list(options),
    queryFn: () => TransferService.findAllTransfers(options),
    ...rest
  });
};

interface TransferQueryOptionsById
  extends Omit<UseQueryOptions<Transfer>, 'queryKey' | 'queryFn'> {
  id: number;
  options: TransferParams;
}

export const useTransferQuery = ({
  id,
  options,
  ...rest
}: TransferQueryOptionsById) => {
  return useQuery({
    queryKey: TRANSFER_KEYS.detail(id, options),
    queryFn: () => TransferService.findByIdTransfer(id, options),
    ...rest
  });
};

export const useShipTransferMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShipTransferDto) => TransferService.shipTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSFER_KEYS.lists() });
    }
  });
};

export const useReceiveTransferMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReceiveTransferDto }) =>
      TransferService.receiveTransfer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TRANSFER_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: TRANSFER_KEYS.details()
      });
    }
  });
};
