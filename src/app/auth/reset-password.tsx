import { createFileRoute, redirect } from '@tanstack/react-router';

import {
  InvalidResetLink,
  ResetPasswordContainer
} from '@/presentation/components/auth/reset-password/ResetPasswordContainer';
import { AuthLayout } from '@/presentation/components/layouts/auth/AuthLayout';
import { resetPasswordRouteSchema } from '@/presentation/schemas/auth.schema';

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
