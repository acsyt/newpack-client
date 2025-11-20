import { createFileRoute } from '@tanstack/react-router';

import { ModeAction } from '@/config/enums/mode-action.enum';
import { UserFormContainer } from '@/presentation/components/users/user-form-container/UserFormContainer';

export const Route = createFileRoute('/_authenticated/users/create')({
  component: () => <UserFormContainer mode={ModeAction.Create} />
});
