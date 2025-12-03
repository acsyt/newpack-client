import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/purchase-orders/')({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Hello "/_authenticated/purchase-orders/"!</div>;
}
