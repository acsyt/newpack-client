import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/suppliers/$supplierId/show'
)({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Hello "/_authenticated/suppliers/$supplierId/show"!</div>;
}
