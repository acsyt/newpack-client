import type { MRT_ColumnDef } from 'material-react-table';
import type { FC } from 'react';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from '@tanstack/react-router';
import { Eye, Pencil } from 'lucide-react';

import { useRolesQuery } from '../../hooks/roles.query';
import { Role } from '../../role.interface';

import { CustomTable } from '@/components/shared/CustomTable';
import { StatusChip } from '@/components/shared/StatusChip';
import { useAuth } from '@/features/auth/hooks/mutations';

interface RoleTableProps {}

export const RoleTable: FC<RoleTableProps> = ({}) => {
  const { permissions } = useAuth();

  const columns = useMemo<MRT_ColumnDef<Role>[]>(
    () => [
      {
        header: 'ID',
        id: 'id',
        size: 20,
        accessorKey: 'id'
      },
      {
        header: 'Nombre',
        id: 'description',
        accessorKey: 'description'
      },
      {
        header: 'Código',
        id: 'name',
        accessorKey: 'name'
      },
      {
        header: 'Estado',
        accessorKey: 'active',
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
      }
    ],
    []
  );

  return (
    <>
      <CustomTable
        enableRowActions
        queryHook={useRolesQuery}
        queryProps={{
          options: {}
        }}
        columns={columns}
        positionActionsColumn='last'
        renderTopToolbarCustomActions={() => (
          <>
            <Box display='flex' gap={2}>
              {permissions.includes('roles.create') && (
                <Link to={'/roles/create'}>
                  <Button variant='contained' color='primary'>
                    Crear Rol
                  </Button>
                </Link>
              )}
            </Box>
          </>
        )}
        renderRowActions={({ row: { original: role } }) => (
          <Box display='flex' gap={1}>
            {permissions.includes('roles.edit') && (
              <Tooltip arrow title={'Editar Rol'}>
                <Link
                  to={'/roles/$roleId/edit'}
                  params={{ roleId: String(role.id) }}
                >
                  <IconButton>
                    <Pencil size={18} />
                  </IconButton>
                </Link>
              </Tooltip>
            )}
            {permissions.includes('roles.show') && (
              <Tooltip arrow title={'Detalles Rol'}>
                <Link
                  to={'/roles/$roleId/show'}
                  params={{ roleId: String(role.id) }}
                >
                  <IconButton>
                    <Eye size={18} />
                  </IconButton>
                </Link>
              </Tooltip>
            )}
          </Box>
        )}
      />
    </>
  );
};
