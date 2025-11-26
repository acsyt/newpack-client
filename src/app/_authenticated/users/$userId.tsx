import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/_authenticated/users/$userId')({
  beforeLoad: async ({ params }) => {
    const validationResult = z.number().safeParse(params.userId);

    if (!validationResult.success)
      throw redirect({
        to: '/users',
        params: { userId: params.userId }
      });
  },
  component: () => <Outlet />
});
