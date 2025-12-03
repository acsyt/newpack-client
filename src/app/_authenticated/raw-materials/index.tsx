import { useMemo } from 'react';

import { Box, Button } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { ProductForm } from '@/features/products/components/ProductForm';
import { RawMaterialRowAction } from '@/features/products/components/raw-material-table/Actions';
import { RawMaterialColumns } from '@/features/products/components/raw-material-table/Columns';
import { useProductsQuery } from '@/features/products/hooks/products.query';
import { useProductDrawerStore } from '@/features/products/product.interface';

export const Route = createFileRoute('/_authenticated/raw-materials/')({
  component: RouteComponent
});

function RouteComponent() {
  const { permissions } = useAuth();

  const memoizedColumns = useMemo(() => RawMaterialColumns, []);

  const { onCreate, isOpen } = useProductDrawerStore();

  return (
    <DashboardLayoutContainer title='Materias Primas'>
      <CustomTable
        enableRowActions
        queryHook={useProductsQuery}
        queryProps={{
          options: {
            filter: {
              type: 'MP'
            }
          }
        }}
        columns={memoizedColumns}
        positionActionsColumn='last'
        renderTopToolbarCustomActions={() => (
          <Box display='flex' gap={1}>
            {permissions.includes('raw-materials.create') && (
              <Button
                variant='contained'
                color='primary'
                startIcon={<Plus size={18} />}
                onClick={() => onCreate('Crear Materia Prima')}
              >
                Crear materia prima
              </Button>
            )}
          </Box>
        )}
        renderRowActions={({ row }) => (
          <RawMaterialRowAction rawMaterial={row.original} />
        )}
      />
      {isOpen && <ProductForm productParams={{}} type='MP' />}
    </DashboardLayoutContainer>
  );
}
