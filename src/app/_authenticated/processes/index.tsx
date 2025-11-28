import { useMemo } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { columns } from '@/features/processes/components/process-table/columns';
import { useProcessesQuery } from '@/features/processes/hooks/processes.query';

export const Route = createFileRoute('/_authenticated/processes/')({
  component: RouteComponent
});

function RouteComponent() {
  const memoizedColumns = useMemo(() => columns, []);

  return (
    <DashboardLayoutContainer title='Listar procesos'>
      <CustomTable
        queryHook={useProcessesQuery}
        queryProps={{
          options: {}
        }}
        columns={memoizedColumns}
      />
    </DashboardLayoutContainer>
  );
}
