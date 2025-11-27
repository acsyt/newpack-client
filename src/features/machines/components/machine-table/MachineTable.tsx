import type { FC } from 'react';

import { useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Eye, Pencil, Plus } from 'lucide-react';
import { DefaultValues, useForm } from 'react-hook-form';

import { MachineDto, machineSchema } from '../../machine.schema';

import { machineColumns } from './columns';

import { CustomTable } from '@/components/shared/CustomTable';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { useAuth } from '@/features/auth/hooks/mutations';
import { useMachinesQuery } from '@/features/machines/hooks/machines.query';
import { Machine } from '@/features/machines/machine.interface';
import { createDrawerStore } from '@/hooks/useDrawerStore';

interface MachineTableProps {}

const useMachineDrawerStore = createDrawerStore<Machine>();

export const MachineTable: FC<MachineTableProps> = ({}) => {
  const { permissions } = useAuth();
  const memoizedColumns = useMemo(() => machineColumns, []);

  const { isOpen, onCreate } = useMachineDrawerStore();

  return (
    <>
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

      <SaveMachineDrawer />
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

interface SaveMachineDrawerProps {}

const SaveMachineDrawer = ({}: SaveMachineDrawerProps) => {
  const { isOpen, onClose, item, mode } = useMachineDrawerStore();

  const defaultValues = useMemo<DefaultValues<MachineDto>>(() => {
    if (item && mode !== ModeAction.Create) {
      return {
        mode,
        id: +item.id,
        code: item.code,
        name: item.name,
        process_id: +item.processId,
        speed_mh: item.speedMh ? +item.speedMh : null,
        speed_kgh: item.speedKgh ? +item.speedKgh : null,
        circumference_total: item.circumferenceTotal
          ? +item.circumferenceTotal
          : null,
        max_width: item.maxWidth ? +item.maxWidth : null,
        max_center: item.maxCenter ? +item.maxCenter : null
      };
    }

    return {
      mode: ModeAction.Create,
      code: '',
      name: '',
      speed_mh: null,
      speed_kgh: null,
      circumference_total: null,
      max_width: null,
      max_center: null
    };
  }, [item, mode]);

  const form = useForm<MachineDto>({
    resolver: zodResolver(machineSchema),
    defaultValues
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Drawer open={isOpen} anchor='right' onClose={onClose}>
      <form
        onSubmit={form.handleSubmit(_data => {
          // Handle submit
        })}
      >
        <pre>{JSON.stringify(item, null, 2)}</pre>
      </form>
    </Drawer>
  );
};
