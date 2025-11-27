import { useMemo } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { columns } from '@/features/machines/components/machine-table/columns';
import { useMachinesQuery } from '@/features/machines/hooks/machines.query';

export const Route = createFileRoute('/_authenticated/machines/')({
  component: RouteComponent
});

function RouteComponent() {
  const memoizedColumns = useMemo(() => columns, []);

  return (
    <DashboardLayoutContainer title='Máquinas'>
      <CustomTable
        queryHook={useMachinesQuery}
        queryProps={{
          options: {
            include: ['process']
          }
        }}
        columns={memoizedColumns}
      />
    </DashboardLayoutContainer>
  );
}
