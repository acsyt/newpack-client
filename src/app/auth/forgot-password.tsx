import { createFileRoute, redirect } from '@tanstack/react-router';

import { AuthLayout } from '@/components/layouts/AuthLayout';
import { ForgotPasswordContainer } from '@/features/auth/components/ForgotPasswordContainer';

export const Route = createFileRoute('/auth/forgot-password')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) throw redirect({ to: '/' });
  },
  component: RouteComponent
});

function RouteComponent() {
  return (
    <AuthLayout>
      <ForgotPasswordContainer />
    </AuthLayout>
  );
}
