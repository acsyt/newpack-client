import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/movements/')({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Hello "/_authenticated/movements/"!</div>;
}
