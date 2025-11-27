import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { WarehouseTable } from '@/features/warehouses/components/warehouse-table/WarehouseTable';

export const Route = createFileRoute('/_authenticated/warehouses/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayoutContainer title='Almacenes'>
      <WarehouseTable />
    </DashboardLayoutContainer>
  );
}
