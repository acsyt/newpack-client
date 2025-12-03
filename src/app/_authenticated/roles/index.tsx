import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { RoleTable } from '@/features/roles/components/role-table/RoleTable';

export const Route = createFileRoute('/_authenticated/roles/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayoutContainer>
      <RoleTable />
    </DashboardLayoutContainer>
  );
}
