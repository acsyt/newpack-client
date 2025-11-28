import { useMemo } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { columns } from '@/features/inventory-stocks/components/stock-table/columns';
import { useInventoryStocksQuery } from '@/features/inventory-stocks/hooks/inventory-stocks.query';

export const Route = createFileRoute('/_authenticated/inventory-stock/')({
  component: RouteComponent
});

function RouteComponent() {
  const memoizedColumns = useMemo(() => columns, []);

  return (
    <DashboardLayoutContainer title='Existencias de Inventario'>
      <CustomTable
        queryHook={useInventoryStocksQuery}
        queryProps={{
          options: {
            include: [
              'product',
              'product.measureUnit',
              'warehouse',
              'warehouseLocation',
              'batch'
            ]
          }
        }}
        columns={memoizedColumns}
        enableRowActions={false}
        initialState={{
          sorting: [{ id: 'id', desc: true }],
          columnVisibility: { id: false }
        }}
      />
    </DashboardLayoutContainer>
  );
}
