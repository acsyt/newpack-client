import { createFileRoute, Outlet } from '@tanstack/react-router';

import { DashboardLayout } from '@/presentation/components/layouts/dashboard/DashboardLayout';
import { DashboardProvider } from '@/presentation/context/dashboard/DashboardProvider';
import { useMenuItems } from '@/presentation/routes/menu-items';

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent
  // beforeLoad(ctx) {
  //   if (!ctx.context.auth.isAuthenticated)
  //     throw redirect({ to: '/auth/login' });

  //   const userPermissions: Permission[] =
  //     ctx.context.auth.user?.permissions || [];
  //   const currentPath = ctx.location.pathname;

  //   if (
  //     ctx.context.auth.user?.userType &&
  //     hasRoleAccess(ctx.context.auth.user.userType, currentPath)
  //   )
  //     return;

  //   if (!checkPermission(userPermissions, currentPath)) {
  //     const defaultRoute = getDefaultRouteByUser(
  //       ctx.context.auth.user!,
  //       userPermissions
  //     );

  //     throw redirect({ to: defaultRoute });
  //   }
  // }
});

function RouteComponent() {
  const { renderMenuItems } = useMenuItems();

  return (
    <DashboardProvider>
      <DashboardLayout menuItems={renderMenuItems}>
        <Outlet />
      </DashboardLayout>
    </DashboardProvider>
  );
}
