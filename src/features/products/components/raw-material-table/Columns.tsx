import type { MRT_ColumnDef } from 'material-react-table';

import dayjs from 'dayjs';

import { Product } from '../../product.interface';

export const RawMaterialColumns: MRT_ColumnDef<Product>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    size: 20
  },
  {
    header: 'Código',
    id: 'sku',
    accessorKey: 'sku',
    size: 100
  },
  {
    header: 'Nombre',
    id: 'name',
    accessorKey: 'name'
  },
  {
    id: 'created_at',
    header: 'Creado el',
    accessorKey: 'createdAt',
    filterVariant: 'date-range',
    size: 150,
    accessorFn: row =>
      row.createdAt
        ? dayjs(row.createdAt)
            .tz(dayjs.tz.guess())
            .format('MM/DD/YYYY HH:mm:ss')
        : '-'
  }
];
