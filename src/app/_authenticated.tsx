import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { DashboardLayout } from '@/components/layouts/dashboard/DashboardLayout';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { DashboardProvider } from '@/features/auth/context/DashboardProvider';
import { useMenuItems } from '@/routes/menu-items';
import { useAuthStore } from '@/stores/auth.store';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href
        }
      });
    }
  },
  component: RouteComponent
});

function RouteComponent() {
  const { renderMenuItems } = useMenuItems();

  return (
    <AuthProvider>
      <DashboardProvider>
        <DashboardLayout menuItems={renderMenuItems}>
          <Outlet />
        </DashboardLayout>
      </DashboardProvider>
    </AuthProvider>
  );
}
