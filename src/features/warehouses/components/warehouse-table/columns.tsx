import type { MRT_ColumnDef } from 'material-react-table';

import { Chip, Tooltip } from '@mui/material';
import dayjs from 'dayjs';

import { Warehouse, WAREHOUSE_TYPES } from '../../warehouse.interface';

const getWarehouseTypeColor = (type: string) => {
  switch (type) {
    case WAREHOUSE_TYPES.MAIN:
      return 'primary';
    case WAREHOUSE_TYPES.SECONDARY:
      return 'secondary';
    case WAREHOUSE_TYPES.STORE:
      return 'success';
    default:
      return 'default';
  }
};

export const warehouseColumns: MRT_ColumnDef<Warehouse>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    size: 80
  },
  {
    header: 'Nombre',
    id: 'name',
    accessorKey: 'name',
    size: 200
  },
  {
    header: 'Tipo',
    id: 'type',
    accessorKey: 'typeName',
    size: 180,
    Cell: ({ row: { original } }) => (
      <Tooltip title={original.typeName}>
        <Chip
          label={original.typeName}
          color={getWarehouseTypeColor(original.type) as any}
          size='small'
          variant='outlined'
        />
      </Tooltip>
    )
  },
  {
    header: 'Estado',
    id: 'active',
    accessorKey: 'active',
    size: 100,
    Cell: ({ row: { original } }) => (
      <Chip
        label={original.active ? 'Activo' : 'Inactivo'}
        color={original.active ? 'success' : 'error'}
        size='small'
        variant='outlined'
      />
    )
  },
  {
    id: 'created_at',
    header: 'Creado el',
    accessorKey: 'createdAt',
    filterVariant: 'date-range',
    size: 180,
    accessorFn: row =>
      row.createdAt
        ? dayjs(row.createdAt).tz(dayjs.tz.guess()).format('DD/MM/YYYY HH:mm')
        : '-'
  },
  {
    id: 'updated_at',
    header: 'Actualizado el',
    accessorKey: 'updatedAt',
    filterVariant: 'date-range',
    size: 180,
    accessorFn: row =>
      row.updatedAt
        ? dayjs(row.updatedAt).tz(dayjs.tz.guess()).format('DD/MM/YYYY HH:mm')
        : '-'
  }
];
