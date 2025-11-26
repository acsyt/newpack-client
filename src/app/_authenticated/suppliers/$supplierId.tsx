import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

import { routeIdSchema } from '@/schemas/route.schema';

export const Route = createFileRoute('/_authenticated/suppliers/$supplierId')({
  beforeLoad: async ({ params }) => {
    const validationResult = routeIdSchema.safeParse(params.supplierId);

    if (!validationResult.success)
      throw redirect({
        to: '/suppliers',
        params: { supplierId: params.supplierId }
      });
  },
  component: () => <Outlet />
});
