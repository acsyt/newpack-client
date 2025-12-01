import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { z } from 'zod';

const roleIdSchema = z
  .string()
  .transform(Number)
  .pipe(z.number().int().positive());

export const Route = createFileRoute('/_authenticated/roles/$roleId')({
  beforeLoad: async ({ params }) => {
    const validationResult = roleIdSchema.safeParse(params.roleId);

    if (!validationResult.success)
      throw redirect({
        to: '/roles',
        params: { roleId: params.roleId }
      });
  },
  component: () => <Outlet />
});
