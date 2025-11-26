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
    header: 'Name',
    id: 'name',
    accessorKey: 'name'
  },
  {
    id: 'username',
    header: 'Username',
    accessorKey: 'username',
    accessorFn: (row): string => row.username || '---'
  },
  {
    header: 'Role',
    id: 'role',
    accessorKey: 'roles',
    accessorFn: (row): string =>
      row.roles ? row.roles.map(role => role.description).join(', ') : '-'
  },
  {
    header: 'Status',
    id: 'active',
    accessorKey: 'active',
    filterVariant: 'select',
    filterSelectOptions: [
      {
        label: 'Active',
        value: 'true'
      },
      {
        label: 'Inactive',
        value: 'false'
      }
    ],
    Cell: ({ row: { original } }) => (
      <StatusChip
        status={original.active}
        activeLabel='Active'
        inactiveLabel='Inactive'
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
    header: 'Updated At',
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
