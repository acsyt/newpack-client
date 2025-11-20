import { createFileRoute } from '@tanstack/react-router';

import { ModeAction } from '@/config/enums/mode-action.enum';
import { UserFormContainer } from '@/presentation/components/users/user-form-container/UserFormContainer';

export const Route = createFileRoute('/_authenticated/users/$userId/edit')({
  component: RouteComponent
});

function RouteComponent() {
  const { userId } = Route.useParams();

  return <UserFormContainer mode={ModeAction.Edit} id={+userId} />;
}
