import type { MRT_ColumnDef } from 'material-react-table';
import type { FC } from 'react';

import { useMemo } from 'react';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from '@tanstack/react-router';
import dayjs from 'dayjs';

import { User } from '@/domain/interfaces/user.interface';
import { CustomTable } from '@/presentation/components/shared/table/custom-table/CustomTable';
import { StatusChip } from '@/presentation/components/shared/table/status-chip/StatusChip';
import { useAuth } from '@/presentation/hooks/auth/useAuth';
import { useUsersQuery } from '@/presentation/queries/users.query';

interface UserTableProps {}

export const UserTable: FC<UserTableProps> = ({}) => {
  const { permissions } = useAuth();

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
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
    ],
    []
  );

  return (
    <>
      <CustomTable
        enableRowActions
        queryHook={useUsersQuery}
        queryProps={{
          options: {}
        }}
        columns={columns}
        positionActionsColumn='last'
        renderTopToolbarCustomActions={() => (
          <Box display='flex' gap={1}>
            {permissions.includes('users.create') && (
              <Link to='/users/create'>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<AddIcon />}
                >
                  Create User
                </Button>
              </Link>
            )}
          </Box>
        )}
        renderRowActions={({ row }) => <RowActions user={row.original} />}
      />
    </>
  );
};

const RowActions = ({ user }: { user: User }) => {
  const { permissions } = useAuth();

  return (
    <>
      <Box display='flex' gap={1}>
        {permissions.includes('users.show') && (
          <Tooltip title='Show'>
            <Link to='/users/$userId/show' params={{ userId: String(user.id) }}>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {permissions.includes('users.edit') && (
          <Tooltip title={'Edit'}>
            <Link to='/users/$userId/edit' params={{ userId: String(user.id) }}>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}
      </Box>
    </>
  );
};
