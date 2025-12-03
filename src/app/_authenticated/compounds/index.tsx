import { useMemo } from 'react';

import { Box, Button } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { CompoundRowAction } from '@/features/products/components/compounds/Actions';
import { CompoundColumns } from '@/features/products/components/compounds/Columns';
import { ProductForm } from '@/features/products/components/ProductForm';
import { useProductsQuery } from '@/features/products/hooks/products.query';
import { useProductDrawerStore } from '@/features/products/product.interface';

export const Route = createFileRoute('/_authenticated/compounds/')({
  component: RouteComponent
});

function RouteComponent() {
  const { permissions } = useAuth();
  const memoizedColumns = useMemo(() => CompoundColumns, []);
  const { onCreate, isOpen } = useProductDrawerStore();

  return (
    <DashboardLayoutContainer title='Compuestos'>
      <CustomTable
        enableRowActions
        queryHook={useProductsQuery}
        queryProps={{
          options: {
            filter: {
              type: 'COMP'
            },
            include: ['ingredients']
          }
        }}
        columns={memoizedColumns}
        positionActionsColumn='last'
        renderTopToolbarCustomActions={() => (
          <Box display='flex' gap={1}>
            {permissions.includes('compounds.create') && (
              <Button
                variant='contained'
                color='primary'
                startIcon={<Plus size={18} />}
                onClick={() => onCreate('Crear Compuesto')}
              >
                Crear compuesto
              </Button>
            )}
          </Box>
        )}
        renderRowActions={({ row }) => (
          <CompoundRowAction compound={row.original} />
        )}
      />
      {isOpen && <ProductForm productParams={{}} type='COMP' />}
    </DashboardLayoutContainer>
  );
}
