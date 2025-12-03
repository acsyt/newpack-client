import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { MovementsTable } from '@/features/inventory-movements/components/movement-table/MovementsTable';

export const Route = createFileRoute('/_authenticated/inventory-movements/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayoutContainer title='Movimientos de Inventario'>
      <MovementsTable />
    </DashboardLayoutContainer>
  );
}
