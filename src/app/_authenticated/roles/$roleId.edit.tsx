import { createFileRoute } from '@tanstack/react-router';

import { ModeAction } from '@/config/enums/mode-action.enum';
import { RoleFormContainer } from '@/features/roles/components/role-form-container/RoleFormContainer';

export const Route = createFileRoute('/_authenticated/roles/$roleId/edit')({
  component: RouteComponent
});

function RouteComponent() {
  const { roleId } = Route.useParams();

  return <RoleFormContainer mode={ModeAction.Edit} id={+roleId} />;
}
