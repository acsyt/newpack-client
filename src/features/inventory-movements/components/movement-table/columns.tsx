import type { MRT_ColumnDef } from 'material-react-table';

import { Chip } from '@mui/material';
import dayjs from 'dayjs';
import { ArrowDown, ArrowUp } from 'lucide-react';

import {
  InventoryMovement,
  MovementType
} from '../../inventory-movement.interface';

const typeColors: Record<
  MovementType,
  'success' | 'error' | 'warning' | 'info' | 'default'
> = {
  purchase_entry: 'success',
  production_output: 'success',
  production_consumption: 'error',
  sales_shipment: 'error',
  adjustment: 'warning',
  transfer: 'info'
};

const typeLabels: Record<MovementType, string> = {
  purchase_entry: 'Entrada por Compra',
  production_output: 'Salida de Producción',
  production_consumption: 'Consumo Producción',
  sales_shipment: 'Salida por Venta',
  adjustment: 'Ajuste',
  transfer: 'Transferencia'
};

const isEntryType = (type: MovementType): boolean => {
  return (
    type === 'purchase_entry' ||
    type === 'production_output' ||
    type === 'adjustment'
  );
};

export const columns: MRT_ColumnDef<InventoryMovement>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    size: 60
  },
  {
    header: 'Fecha/Hora',
    id: 'createdAt',
    accessorKey: 'createdAt',
    filterVariant: 'date-range',
    size: 160,
    accessorFn: row =>
      row.createdAt
        ? dayjs(row.createdAt).tz(dayjs.tz.guess()).format('DD/MM/YYYY HH:mm')
        : '-'
  },
  {
    header: 'Tipo',
    id: 'type',
    accessorKey: 'type',
    size: 180,
    filterVariant: 'select',
    filterSelectOptions: [
      { label: 'Entrada por Compra', value: 'purchase_entry' },
      { label: 'Salida de Producción', value: 'production_output' },
      { label: 'Consumo Producción', value: 'production_consumption' },
      { label: 'Salida por Venta', value: 'sales_shipment' },
      { label: 'Ajuste', value: 'adjustment' },
      { label: 'Transferencia', value: 'transfer' }
    ],
    Cell: ({ row: { original } }) => (
      <Chip
        label={typeLabels[original.type]}
        color={typeColors[original.type]}
        size='small'
        icon={
          isEntryType(original.type) ? (
            <ArrowUp size={16} />
          ) : (
            <ArrowDown size={16} />
          )
        }
      />
    )
  },
  {
    header: 'SKU',
    id: 'sku',
    accessorFn: row => row.product?.sku || '-',
    size: 120
  },
  {
    header: 'Producto',
    id: 'product',
    accessorFn: row => row.product?.name || '-',
    size: 200
  },
  {
    header: 'Almacén',
    id: 'warehouse',
    accessorFn: row => (row.warehouse ? row.warehouse.name : '-'),
    size: 150
  },
  {
    header: 'Cantidad',
    id: 'quantity',
    accessorKey: 'quantity',
    size: 100,
    Cell: ({ row: { original } }) => {
      const quantity = Number(original.quantity);
      const isEntry = isEntryType(original.type);

      return (
        <span
          style={{
            fontWeight: 'bold',
            color: isEntry ? 'green' : 'red'
          }}
        >
          {isEntry ? '+' : '-'}
          {Math.abs(quantity).toFixed(2)}{' '}
          {original.product?.measureUnit?.code || ''}
        </span>
      );
    }
  },
  {
    header: 'Saldo Resultante',
    id: 'balanceAfter',
    accessorKey: 'balanceAfter',
    size: 140,
    Cell: ({ row: { original } }) => {
      const balance = Number(original.balanceAfter);

      return (
        <span style={{ fontWeight: 'bold' }}>
          {balance.toFixed(2)} {original.product?.measureUnit?.code || ''}
        </span>
      );
    }
  },
  {
    header: 'Usuario',
    id: 'user',
    accessorFn: row =>
      row.user ? `${row.user.name} ${row.user.lastName}` : '-',
    size: 150
  },
  {
    header: 'Referencia',
    id: 'reference',
    accessorFn: row =>
      row.referenceType && row.referenceId
        ? `${row.referenceType.split('\\').pop()} #${row.referenceId}`
        : '-',
    size: 150
  }
];
