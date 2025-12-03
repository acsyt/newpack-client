import { useMemo } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { columns } from '@/features/product-classes/components/product-class-table/columns';
import { useProductClassesQuery } from '@/features/product-classes/hooks/product-classes.query';

export const Route = createFileRoute('/_authenticated/classes/')({
  component: RouteComponent
});

function RouteComponent() {
  const memoizedColumns = useMemo(() => columns, []);

  return (
    <DashboardLayoutContainer>
      <CustomTable
        queryHook={useProductClassesQuery}
        queryProps={{
          options: {}
        }}
        columns={memoizedColumns}
      />
    </DashboardLayoutContainer>
  );
}
