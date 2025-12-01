import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { columns } from '@/features/suppliers/components/supplier-table/columns';
import { useSupplierQuery } from '@/features/suppliers/hooks/supplier.query';
import { RowActions } from '@/features/suppliers/components/supplier-table/actions';

export const Route = createFileRoute('/_authenticated/suppliers/')({
  component: RouteComponent
});

function RouteComponent() {
  const { permissions } = useAuth();
  
    const memoizedColumns = useMemo(() => columns, []);
  
    return (
      <DashboardLayoutContainer title='Proveedores registrados'>
        <CustomTable
          enableRowActions
          queryHook={useSupplierQuery}
          queryProps={{
            options: {}
          }}
          columns={memoizedColumns}
          positionActionsColumn='last'
          renderTopToolbarCustomActions={() => (
            <Box display='flex' gap={1}>
              {permissions.includes('suppliers.create') && (
                <Link to='/suppliers/create'>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<Plus size={18} />}
                  >
                    Crear proveedor
                  </Button>
                </Link>
              )}
            </Box>
          )}
          renderRowActions={({ row }) => <RowActions supplier={row.original} />}
        />
      </DashboardLayoutContainer>
    );
}
