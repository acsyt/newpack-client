import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { RowActions } from '@/features/users/components/user-table/actions';
import { columns } from '@/features/users/components/user-table/columns';
import { useUsersQuery } from '@/features/users/hooks/users.query';

export const Route = createFileRoute('/_authenticated/users/')({
  component: RouteComponent
});

function RouteComponent() {
  const { permissions } = useAuth();

  const memoizedColumns = useMemo(() => columns, []);

  return (
    <DashboardLayoutContainer title='Usuarios registrados'>
      <CustomTable
        enableRowActions
        queryHook={useUsersQuery}
        queryProps={{
          options: {}
        }}
        columns={memoizedColumns}
        positionActionsColumn='last'
        renderTopToolbarCustomActions={() => (
          <Box display='flex' gap={1}>
            {permissions.includes('users.create') && (
              <Link to='/users/create'>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<Plus size={18} />}
                >
                  Crear usuario
                </Button>
              </Link>
            )}
          </Box>
        )}
        renderRowActions={({ row }) => <RowActions user={row.original} />}
      />
    </DashboardLayoutContainer>
  );
}
