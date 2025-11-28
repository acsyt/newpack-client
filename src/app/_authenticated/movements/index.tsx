import { useMemo } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { columns } from '@/features/inventory-movements/components/movement-table/columns';
import { useInventoryMovementsQuery } from '@/features/inventory-movements/hooks/inventory-movements.query';

export const Route = createFileRoute('/_authenticated/movements/')({
  component: RouteComponent
});

function RouteComponent() {
  const memoizedColumns = useMemo(() => columns, []);

  return (
    <DashboardLayoutContainer title='Movimientos de Inventario (Kardex)'>
      <CustomTable
        queryHook={useInventoryMovementsQuery}
        queryProps={{
          options: {
            include: [
              'product',
              'product.measureUnit',
              'warehouse',
              'warehouseLocation',
              'batch',
              'user'
            ]
          }
        }}
        columns={memoizedColumns}
        enableRowActions={false}
        initialState={{
          sorting: [{ id: 'created_at', desc: true }],
          columnVisibility: { id: false }
        }}
      />
    </DashboardLayoutContainer>
  );
}
