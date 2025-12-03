import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/purchased-orders/')({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Hello "/_authenticated/purchased-orders/"!</div>;
}
