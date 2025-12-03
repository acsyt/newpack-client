import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';

export const Route = createFileRoute('/_authenticated/processes/bolsa-en-rollo')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayoutContainer title='Proceso: Bolsa En Rollo'>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Bolsa En Rollo</h2>
        <p>Información específica del proceso de Bolsa En Rollo.</p>
      </div>
    </DashboardLayoutContainer>
  );
}
