import { useMemo } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { columns } from '@/features/product-subclasses/components/product-subclass-table/columns';
import { useProductSubclassesQuery } from '@/features/product-subclasses/hooks/product-subclasses.query';

export const Route = createFileRoute('/_authenticated/subclasses/')({
  component: RouteComponent
});

function RouteComponent() {
  const memoizedColumns = useMemo(() => columns, []);

  return (
    <DashboardLayoutContainer title='Subclases de Productos'>
      <CustomTable
        queryHook={useProductSubclassesQuery}
        queryProps={{
          options: {
            include: ['productClass']
          }
        }}
        columns={memoizedColumns}
      />
    </DashboardLayoutContainer>
  );
}
