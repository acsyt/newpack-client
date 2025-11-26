import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/suppliers/$supplierId/edit'
)({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Hello "/_authenticated/suppliers/$supplierId/edit"!</div>;
}
