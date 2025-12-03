import { FC, useMemo, useState } from 'react';

import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import { PackageCheck, Eye } from 'lucide-react';
import { MRT_ColumnDef } from 'material-react-table';

import { CustomTable } from '@/components/shared/CustomTable';
import { ReceiveTransferDrawer } from '@/features/inventory-movements/components/movement-table/ReceiveTransferDrawer';
import { useTransfersQuery } from '@/features/transfers/hooks/transfers.query';
import {
  Transfer,
  TransferStatus
} from '@/features/transfers/transfer.interface';

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

export const TransfersTable: FC = () => {
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
        id: 'transfer_number',
        accessorKey: 'transferNumber',
        header: 'N° Transferencia',
        size: 150
      },
      {
        id: 'sourceWarehouse.name',
        accessorKey: 'sourceWarehouse.name',
        header: 'Almacén Origen',
        size: 180
      },
      {
        id: 'destinationWarehouse.name',
        accessorKey: 'destinationWarehouse.name',
        header: 'Almacén Destino',
        size: 180
      },
      {
        id: 'status',
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
        id: 'total_items_count',
        accessorKey: 'totalItemsCount',
        header: 'Items',
        size: 80,
        Cell: ({ row }) => row.original.totalItemsCount || 0
      },
      {
        id: 'shipped_at',
        accessorKey: 'shippedAt',
        header: 'Fecha Envío',
        size: 150,
        Cell: ({ row }) =>
          row.original.shippedAt
            ? dayjs(row.original.shippedAt).format('DD MMM YYYY, HH:mm')
            : '-'
      },
      {
        id: 'received_at',
        accessorKey: 'receivedAt',
        header: 'Fecha Recepción',
        size: 150,
        Cell: ({ row }) =>
          row.original.receivedAt
            ? dayjs(row.original.receivedAt).format('DD MMM YYYY, HH:mm')
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
