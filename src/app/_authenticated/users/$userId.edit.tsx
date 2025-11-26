import { createFileRoute } from '@tanstack/react-router';

import { ModeAction } from '@/config/enums/mode-action.enum';
import { UserFormContainer } from '@/features/users/components/UserFormContainer';

export const Route = createFileRoute('/_authenticated/users/$userId/edit')({
  component: RouteComponent
});

function RouteComponent() {
  const { userId } = Route.useParams();

  return (
    <UserFormContainer
      mode={ModeAction.Edit}
      userId={Number(userId)}
      title='Edit User'
    />
  );
}
