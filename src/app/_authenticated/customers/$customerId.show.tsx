import { createFileRoute } from '@tanstack/react-router';

import { ModeAction } from '@/config/enums/mode-action.enum';
import { CustomerFormContainer } from '@/features/customers/components/CustomerFormContainer';

export const Route = createFileRoute(
  '/_authenticated/customers/$customerId/show'
)({
  component: RouteComponent
});

function RouteComponent() {
  const { customerId } = Route.useParams();

  return (
    <CustomerFormContainer
      mode={ModeAction.Show}
      customerId={Number(customerId)}
      title='Detalles Cliente'
    />
  );
}
