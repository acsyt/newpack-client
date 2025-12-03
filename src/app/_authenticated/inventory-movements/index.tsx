import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { MovementsTable } from '@/features/inventory-movements/components/movement-table/MovementsTable';
import { TransfersTable } from '@/features/transfers/components/transfers-table/TransfersTable';

export const Route = createFileRoute('/_authenticated/inventory-movements/')({
  component: RouteComponent
});

enum TabEnum {
  Movements,
  Transfers
}

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<TabEnum>(TabEnum.Movements);

  return (
    <DashboardLayoutContainer title='Movimientos de Inventario'>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          <Tab value={TabEnum.Movements} label='Movimientos (Kardex)' />
          <Tab value={TabEnum.Transfers} label='Transferencias' />
        </Tabs>
      </Box>

      {activeTab === TabEnum.Movements && <MovementsTable />}
      {activeTab === TabEnum.Transfers && <TransfersTable />}
    </DashboardLayoutContainer>
  );
}
