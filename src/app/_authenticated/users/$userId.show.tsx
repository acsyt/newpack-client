import { createFileRoute } from '@tanstack/react-router';

import { ModeAction } from '@/config/enums/mode-action.enum';
import { UserFormContainer } from '@/features/users/components/UserFormContainer';

export const Route = createFileRoute('/_authenticated/users/$userId/show')({
  component: RouteComponent
});

function RouteComponent() {
  const { userId } = Route.useParams();

  return (
    <UserFormContainer
      mode={ModeAction.Show}
      userId={Number(userId)}
      title='Show User'
    />
  );
}
