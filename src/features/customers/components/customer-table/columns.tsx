import type { MRT_ColumnDef } from 'material-react-table';

import dayjs from 'dayjs';

import { Customer } from '@/features/customers/customer.interface';

// Name, apellido, email, telefono, rfc, status, update,

export const columns: MRT_ColumnDef<Customer>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
    size: 60
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Nombre'
  },
  {
    id: 'lastName',
    accessorKey: 'lastName',
    header: 'Apellido'
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email'
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: 'Teléfono'
  },
  {
    id: 'rfc',
    accessorKey: 'rfc',
    header: 'RFC'
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Estatus'
  },
  {
    id: 'updated_at',
    header: 'Actualizado el',
    accessorKey: 'updatedAt',
    filterVariant: 'date-range',
    size: 100,
    accessorFn: row =>
      row.updatedAt
        ? dayjs(row.updatedAt)
            .tz(dayjs.tz.guess())
            .format('MM/DD/YYYY HH:mm:ss')
        : '-'
  }
];
