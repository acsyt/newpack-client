import { FC } from 'react';

import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Eye, Pencil } from 'lucide-react';

import { Machine } from '../../machine.interface';

import { useMachineDrawerStore } from '@/app/_authenticated/machines';
import { useAuth } from '@/features/auth/hooks/mutations';

interface MachineRowActionProps {
  machine: Machine;
}
export const MachineRowAction: FC<MachineRowActionProps> = ({ machine }) => {
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
