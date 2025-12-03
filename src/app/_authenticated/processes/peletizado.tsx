import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/processes/peletizado')({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Hello "/_authenticated/processes/peletizado"!</div>;
}
