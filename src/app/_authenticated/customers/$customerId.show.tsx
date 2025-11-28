import { ModeAction } from '@/config/enums/mode-action.enum';
import { CustomerFormContainer } from '@/features/customers/components/CustomerFormContainer';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/customers/$customerId/show',
)({
  component: RouteComponent,
})

function RouteComponent() {
  
  const { customerId } = Route.useParams();
  
  return (
    <CustomerFormContainer
      mode={ModeAction.Show}
      customerId={Number(customerId)}
      title='Show Customer'
    />
  )
}
