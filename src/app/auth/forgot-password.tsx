import { createFileRoute, redirect } from '@tanstack/react-router';

import { ForgotPasswordContainer } from '@/presentation/components/auth/forgot-password/ForgotPasswordContainer';
import { AuthLayout } from '@/presentation/components/layouts/auth/AuthLayout';

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
