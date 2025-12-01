import type { MRT_ColumnDef } from 'material-react-table';

import { Chip } from '@mui/material';

import {
  InventoryStock,
  InventoryStockStatus
} from '../../inventory-stock.interface';

const statusColors: Record<
  InventoryStockStatus,
  'success' | 'error' | 'warning' | 'info' | 'default'
> = {
  [InventoryStockStatus.Available]: 'success',
  [InventoryStockStatus.Reserved]: 'warning',
  [InventoryStockStatus.Damaged]: 'error'
} as const;

const statusLabels: Record<InventoryStockStatus, string> = {
  [InventoryStockStatus.Available]: 'Disponible',
  [InventoryStockStatus.Reserved]: 'Reservado',
  [InventoryStockStatus.Damaged]: 'Dañado'
} as const;

export const columns: MRT_ColumnDef<InventoryStock>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    size: 60
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
    header: 'Tipo',
    id: 'productType',
    accessorFn: row => row.product?.productType?.name || '-',
    size: 180
  },
  {
    header: 'Almacén',
    id: 'warehouse',
    accessorFn: row => (row.warehouse ? row.warehouse.name : '-'),
    size: 150
  },
  {
    header: 'Ubicación',
    id: 'location',
    accessorFn: row =>
      row.warehouseLocation
        ? row.warehouseLocation.aisle +
          ' - ' +
          row.warehouseLocation.shelf +
          ' - ' +
          row.warehouseLocation.section
        : '-',
    size: 150
  },
  {
    header: 'Lote',
    id: 'batch',
    accessorFn: row => row.batch?.code || '-',
    size: 100
  },
  {
    header: 'Stock Actual',
    id: 'quantity',
    accessorKey: 'quantity',
    size: 100,
    Cell: ({ row: { original } }) => {
      const quantity = Number(original.quantity);

      return (
        <span style={{ fontWeight: 'bold' }}>
          {quantity.toFixed(2)} {original.product?.measureUnit?.code || ''}
        </span>
      );
    }
  },
  {
    header: 'Estado',
    id: 'status',
    accessorKey: 'status',
    size: 120,
    filterVariant: 'select',
    filterSelectOptions: [
      { label: 'Disponible', value: 'available' },
      { label: 'Reservado', value: 'reserved' },
      { label: 'Dañado', value: 'damaged' }
    ],
    Cell: ({ row: { original } }) => (
      <Chip
        label={statusLabels[original.status]}
        color={statusColors[original.status]}
        size='small'
      />
    )
  }
];
