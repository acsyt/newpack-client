import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/roles/')({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Hello "/_authenticated/roles/"!</div>;
}
