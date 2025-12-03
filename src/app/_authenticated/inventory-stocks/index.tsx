import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { InventoryStocksTable } from '@/features/inventory-stocks/components/stock-table/InventoryStocksTable';

export const Route = createFileRoute('/_authenticated/inventory-stocks/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayoutContainer>
      <InventoryStocksTable />
    </DashboardLayoutContainer>
  );
}
