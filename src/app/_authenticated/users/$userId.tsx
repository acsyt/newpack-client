import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { z } from 'zod';

const userIdSchema = z
  .string()
  .transform(Number)
  .pipe(z.number().int().positive());

export const Route = createFileRoute('/_authenticated/users/$userId')({
  beforeLoad: async ({ params }) => {
    const validationResult = userIdSchema.safeParse(params.userId);

    if (!validationResult.success)
      throw redirect({
        to: '/users',
        params: { userId: params.userId }
      });
  },
  component: () => <Outlet />
});
