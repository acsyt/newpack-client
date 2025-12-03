import { useMemo } from 'react';

import { Box, Button } from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { RowActions } from '@/features/customers/components/customer-table/actions';
import { columns } from '@/features/customers/components/customer-table/columns';
import { useCustomerQuery } from '@/features/customers/hook/customer.query';

export const Route = createFileRoute('/_authenticated/customers/')({
  component: RouteComponent
});

function RouteComponent() {
  const { permissions } = useAuth();

  const memoizedColumns = useMemo(() => columns, []);

  return (
    <DashboardLayoutContainer title='Clientes registrados'>
      <CustomTable
        enableRowActions
        queryHook={useCustomerQuery}
        queryProps={{
          options: {}
        }}
        columns={memoizedColumns}
        positionActionsColumn='last'
        renderTopToolbarCustomActions={() => (
          <Box display='flex' gap={1}>
            {permissions.includes('customers.create') && (
              <Link to='/customers/create'>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<Plus size={18} />}
                >
                  Crear Cliente
                </Button>
              </Link>
            )}
          </Box>
        )}
        renderRowActions={({ row }) => <RowActions customer={row.original} />}
      />
    </DashboardLayoutContainer>
  );
}
