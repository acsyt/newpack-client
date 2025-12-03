import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';

export const Route = createFileRoute('/_authenticated/processes/impresion')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayoutContainer title='Proceso: Impresión'>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Impresión</h2>
        <p>Información específica del proceso de Impresión.</p>
      </div>
    </DashboardLayoutContainer>
  );
}
