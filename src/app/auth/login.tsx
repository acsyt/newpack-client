import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

import { LoginContainer } from '@/presentation/components/auth/login/LoginContainer';
import { AuthLayout } from '@/presentation/components/layouts/auth/AuthLayout';

export const Route = createFileRoute('/auth/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch('')
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect ?? '/' });
    }
  },
  component: RouteComponent
});

function RouteComponent() {
  return (
    <AuthLayout>
      <LoginContainer />
    </AuthLayout>
  );
}
