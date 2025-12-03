import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';

export const Route = createFileRoute('/_authenticated/processes/extrusion')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayoutContainer title='Proceso: Extrusión'>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Extrusión</h2>
        <p>Información específica del proceso de Extrusión.</p>
      </div>
    </DashboardLayoutContainer>
  );
}
