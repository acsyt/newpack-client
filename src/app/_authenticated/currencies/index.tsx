import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CurrencyTable } from '@/features/currencies/components/currency-table/CurrencyTable';

export const Route = createFileRoute('/_authenticated/currencies/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayoutContainer title='Listado de Tipos de Monedas'>
      <CurrencyTable />
    </DashboardLayoutContainer>
  );
}
