import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/customers/$customerId/edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/customers/$customerId/edit"!</div>
}
