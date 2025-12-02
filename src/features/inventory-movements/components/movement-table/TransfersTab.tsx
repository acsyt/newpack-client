import { FC, useMemo, useState } from 'react';

import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { PackageCheck, Eye } from 'lucide-react';
import { MRT_ColumnDef } from 'material-react-table';

import { useTransfersQuery } from '../../../transfers/hooks/transfers.query';
import {
  Transfer,
  TransferStatus
} from '../../../transfers/transfer.interface';

import { ReceiveTransferDrawer } from './ReceiveTransferDrawer';

import { CustomTable } from '@/components/shared/CustomTable';

const statusColors: Record<
  TransferStatus,
  'warning' | 'info' | 'success' | 'error'
> = {
  [TransferStatus.Pending]: 'warning',
  [TransferStatus.Shipped]: 'info',
  [TransferStatus.Completed]: 'success',
  [TransferStatus.Cancelled]: 'error'
};

const statusLabels: Record<TransferStatus, string> = {
  [TransferStatus.Pending]: 'Pendiente',
  [TransferStatus.Shipped]: 'Enviado',
  [TransferStatus.Completed]: 'Completado',
  [TransferStatus.Cancelled]: 'Cancelado'
};

export const TransfersTab: FC = () => {
  const [receiveDrawerOpen, setReceiveDrawerOpen] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState<number | null>(
    null
  );

  const handleReceiveClick = (transfer: Transfer) => {
    setSelectedTransferId(transfer.id);
    setReceiveDrawerOpen(true);
  };

  const handleCloseReceiveDrawer = () => {
    setReceiveDrawerOpen(false);
    setSelectedTransferId(null);
  };

  const columns: MRT_ColumnDef<Transfer>[] = useMemo(
    () => [
      {
        accessorKey: 'transferNumber',
        header: 'N° Transferencia',
        size: 150
      },
      {
        accessorKey: 'sourceWarehouse.name',
        header: 'Almacén Origen',
        size: 180
      },
      {
        accessorKey: 'destinationWarehouse.name',
        header: 'Almacén Destino',
        size: 180
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        size: 130,
        Cell: ({ row }) => (
          <Chip
            label={statusLabels[row.original.status as TransferStatus]}
            color={statusColors[row.original.status as TransferStatus]}
            size='small'
            sx={{ fontWeight: 600 }}
          />
        )
      },
      {
        accessorKey: 'totalItemsCount',
        header: 'Items',
        size: 80,
        Cell: ({ row }) =>
          row.original.totalItemsCount || row.original.items?.length || 0
      },
      {
        accessorKey: 'shippedAt',
        header: 'Fecha Envío',
        size: 150,
        Cell: ({ row }) =>
          row.original.shippedAt
            ? new Date(row.original.shippedAt).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : '-'
      },
      {
        accessorKey: 'receivedAt',
        header: 'Fecha Recepción',
        size: 150,
        Cell: ({ row }) =>
          row.original.receivedAt
            ? new Date(row.original.receivedAt).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : '-'
      }
    ],
    []
  );

  return (
    <>
      <CustomTable
        enableRowActions
        queryHook={useTransfersQuery}
        queryProps={{
          options: {
            include: ['sourceWarehouse', 'destinationWarehouse', 'items']
          }
        }}
        columns={columns}
        renderRowActions={({ row }) => (
          <>
            <Tooltip title='Ver Detalles'>
              <IconButton size='small'>
                <Eye size={18} />
              </IconButton>
            </Tooltip>
            {row.original.status === TransferStatus.Shipped && (
              <Tooltip title='Recibir Transferencia'>
                <IconButton
                  size='small'
                  color='primary'
                  onClick={() => handleReceiveClick(row.original)}
                >
                  <PackageCheck size={18} />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      />

      <ReceiveTransferDrawer
        isOpen={receiveDrawerOpen}
        transferId={selectedTransferId}
        onClose={handleCloseReceiveDrawer}
      />
    </>
  );
};
