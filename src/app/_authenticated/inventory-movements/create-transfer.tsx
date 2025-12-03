import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/inventory-movements/create-transfer'
)({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div>Hello "/_authenticated/inventory-movements/create-transfer"!</div>
  );
}
