import type { MRT_ColumnDef } from 'material-react-table';

import dayjs from 'dayjs';

import { User } from '../../user.interface';

import { StatusChip } from '@/components/shared/StatusChip';

export const columns: MRT_ColumnDef<User>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    size: 20
  },
  {
    header: 'Nombre',
    id: 'name',
    accessorKey: 'name'
  },
  {
    header: 'Apellido',
    id: 'lastName',
    accessorKey: 'lastName'
  },
  {
    header: 'Estado',
    id: 'active',
    accessorKey: 'isActive',
    filterVariant: 'select',
    filterSelectOptions: [
      {
        label: 'Activo',
        value: 'true'
      },
      {
        label: 'Inactivo',
        value: 'false'
      }
    ],
    Cell: ({ row: { original } }) => (
      <StatusChip
        status={original.active}
        activeLabel='Activo'
        inactiveLabel='Inactivo'
      />
    )
  },
  {
    header: 'Email',
    id: 'email',
    accessorKey: 'email'
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
