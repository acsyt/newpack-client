import type { MRT_ColumnDef } from 'material-react-table';

import dayjs from 'dayjs';

import { ProductSubclass } from '../../product-subclass.interface';

export const columns: MRT_ColumnDef<ProductSubclass>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    size: 20
  },
  {
    header: 'Código',
    id: 'code',
    accessorKey: 'code',
    size: 100
  },
  {
    header: 'Nombre',
    id: 'name',
    accessorKey: 'name'
  },
  {
    header: 'Clase',
    id: 'productClass',
    accessorKey: 'productClass.name',
    Cell: ({ row: { original } }) => original.productClass?.name || '-'
  },
  {
    header: 'Descripción',
    id: 'description',
    accessorKey: 'description',
    Cell: ({ row: { original } }) => original.description || '-'
  },
  {
    id: 'updated_at',
    header: 'Actualizado el',
    accessorKey: 'updatedAt',
    filterVariant: 'date-range',
    size: 150,
    accessorFn: row =>
      row.updatedAt
        ? dayjs(row.updatedAt)
            .tz(dayjs.tz.guess())
            .format('MM/DD/YYYY HH:mm:ss')
        : '-'
  }
];
