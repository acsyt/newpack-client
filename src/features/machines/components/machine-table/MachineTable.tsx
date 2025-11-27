import type { FC } from 'react';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Eye, Pencil, Plus } from 'lucide-react';

import { machineColumns } from './columns';
import { SaveMachineDrawer } from './SaveMachineDrawer';

import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { useMachinesQuery } from '@/features/machines/hooks/machines.query';
import { Machine, MachineParams } from '@/features/machines/machine.interface';
import { createDrawerStore } from '@/hooks/useDrawerStore';

interface MachineTableProps {}

export const useMachineDrawerStore = createDrawerStore<Machine>();

const machineParams: MachineParams = {
  include: ['process']
};

export const MachineTable: FC<MachineTableProps> = ({}) => {
  const { permissions } = useAuth();
  const memoizedColumns = useMemo(() => machineColumns, []);

  const { isOpen, onCreate } = useMachineDrawerStore();

  return (
    <>
      <CustomTable
        queryHook={useMachinesQuery}
        queryProps={{
          options: machineParams
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

      {isOpen && <SaveMachineDrawer machineParams={machineParams} />}
    </>
  );
};

interface MachineRowActionProps {
  machine: Machine;
}
const MachineRowAction: FC<MachineRowActionProps> = ({ machine }) => {
  const { permissions } = useAuth();
  const { onEdit, onShow } = useMachineDrawerStore();

  return (
    <Box display='flex' gap={1}>
      {permissions.includes('machines.show') && (
        <Tooltip title='Show'>
          <IconButton onClick={() => onShow(machine)}>
            <Eye size={18} />
          </IconButton>
        </Tooltip>
      )}
      {permissions.includes('machines.edit') && (
        <Tooltip title={'Edit'}>
          <IconButton onClick={() => onEdit(machine)}>
            <Pencil size={18} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
