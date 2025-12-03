import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { MovementsTable } from '@/features/inventory-movements/components/movement-table/MovementsTable';
import { TransfersTable } from '@/features/transfers/components/transfers-table/TransfersTable';

export enum InventoryMovementTabEnum {
  Movements = 'movements',
  Transfers = 'transfers'
}

const routeSchema = z.object({
  tab: z
    .nativeEnum(InventoryMovementTabEnum)
    .default(InventoryMovementTabEnum.Movements)
    .catch(InventoryMovementTabEnum.Movements)
});

export const Route = createFileRoute('/_authenticated/inventory-movements/')({
  component: RouteComponent,
  validateSearch: search => routeSchema.parse(search)
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const activeTab = search.tab;

  const onChangeTab = (
    _: React.SyntheticEvent,
    newValue: InventoryMovementTabEnum
  ) => {
    navigate({
      search: prev => ({ ...prev, tab: newValue }),
      replace: true
    });
  };

  return (
    <DashboardLayoutContainer title='Movimientos de Inventario'>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={onChangeTab}>
          <Tab
            value={InventoryMovementTabEnum.Movements}
            label='Movimientos (Kardex)'
          />
          <Tab
            value={InventoryMovementTabEnum.Transfers}
            label='Transferencias'
          />
        </Tabs>
      </Box>

      {activeTab === InventoryMovementTabEnum.Movements && <MovementsTable />}
      {activeTab === InventoryMovementTabEnum.Transfers && <TransfersTable />}
    </DashboardLayoutContainer>
  );
}
