import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';

export const Route = createFileRoute('/_authenticated/processes/bolsa-suelta')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayoutContainer title='Proceso: Bolsa Suelta'>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Bolsa Suelta</h2>
        <p>Información específica del proceso de Bolsa Suelta.</p>
      </div>
    </DashboardLayoutContainer>
  );
}
