import { ModeAction } from '@/config/enums/mode-action.enum';
import { CustomerFormContainer } from '@/features/customers/components/CustomerFormContainer';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/customers/$customerId/edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { customerId } = Route.useParams();

    return (
      <CustomerFormContainer
        mode={ModeAction.Edit}
        customerId={Number(customerId)}
        title='Editar Cliente'
      />
    )
}
