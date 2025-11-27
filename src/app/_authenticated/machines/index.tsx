import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { MachineTable } from '@/features/machines/components/machine-table/MachineTable';

export const Route = createFileRoute('/_authenticated/machines/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayoutContainer title='Máquinas'>
      <MachineTable />
    </DashboardLayoutContainer>
  );
}
