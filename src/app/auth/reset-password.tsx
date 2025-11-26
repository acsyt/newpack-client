import { createFileRoute, redirect } from '@tanstack/react-router';

import { AuthLayout } from '@/components/layouts/AuthLayout';
import { resetPasswordRouteSchema } from '@/features/auth/auth.schema';
import {
  InvalidResetLink,
  ResetPasswordContainer
} from '@/features/auth/components/ResetPasswordContainer';

export const Route = createFileRoute('/auth/reset-password')({
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) throw redirect({ to: '/' });
    if (
      !search.token ||
      !search.email ||
      search.token.trim() === '' ||
      search.email.trim() === ''
    ) {
      throw redirect({
        to: '/auth/forgot-password',
        search: { error: 'missing-params' }
      });
    }
  },
  validateSearch: resetPasswordRouteSchema,
  component: RouteComponent,
  errorComponent: () => (
    <AuthLayout>
      <InvalidResetLink />
    </AuthLayout>
  )
});

function RouteComponent() {
  return (
    <AuthLayout layoutVariant='default'>
      <ResetPasswordContainer />
    </AuthLayout>
  );
}
