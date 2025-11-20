import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

import { routeIdSchema } from '@/presentation/schemas/route.schema';

export const Route = createFileRoute('/_authenticated/users/$userId')({
  beforeLoad: async ({ params }) => {
    const validationResult = routeIdSchema.safeParse(params.userId);

    if (!validationResult.success)
      throw redirect({
        to: '/users',
        params: { userId: params.userId }
      });
  },
  component: () => <Outlet />
});
