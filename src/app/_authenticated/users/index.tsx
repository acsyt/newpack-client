import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/presentation/components/layouts/dashboard/DashboardLayoutContainer';
import { UserTable } from '@/presentation/components/users/user-table/UserTable';

export const Route = createFileRoute('/_authenticated/users/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayoutContainer title='List of Users'>
      <UserTable />
    </DashboardLayoutContainer>
  );
}
