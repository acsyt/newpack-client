import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/machines/')({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Hello "/_authenticated/machines/"!</div>;
}
