import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { MachineRowAction } from '@/features/machines/components/machine-table/actions';
import { machineColumns } from '@/features/machines/components/machine-table/columns';
import { SaveMachineDrawer } from '@/features/machines/components/machine-table/SaveMachineDrawer';
import { useMachinesQuery } from '@/features/machines/hooks/machines.query';
import { Machine } from '@/features/machines/machine.interface';
import { createDrawerStore } from '@/hooks/useDrawerStore';

export const useMachineDrawerStore = createDrawerStore<Machine>();

export const Route = createFileRoute('/_authenticated/machines/')({
  component: RouteComponent
});

function RouteComponent() {
  const { permissions } = useAuth();
  const memoizedColumns = useMemo(() => machineColumns, []);

  const { isOpen, onCreate } = useMachineDrawerStore();

  return (
    <DashboardLayoutContainer title='Máquinas'>
      <CustomTable
        queryHook={useMachinesQuery}
        queryProps={{
          options: {
            include: ['process']
          }
        }}
        columns={memoizedColumns}
        positionActionsColumn='last'
        renderTopToolbarCustomActions={() => (
          <Box display='flex' gap={1}>
            {permissions.includes('machines.create') && (
              <Button
                variant='contained'
                color='primary'
                startIcon={<Plus size={18} />}
                onClick={onCreate}
              >
                Crear maquina
              </Button>
            )}
          </Box>
        )}
        renderRowActions={({ row }) => (
          <MachineRowAction machine={row.original} />
        )}
      />

      {isOpen && <SaveMachineDrawer machineParams={{ include: ['process'] }} />}
    </DashboardLayoutContainer>
  );
}
