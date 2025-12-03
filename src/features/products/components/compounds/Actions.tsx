import { FC } from 'react';

import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Eye, Pencil } from 'lucide-react';

import { Product } from '../../product.interface';
import { useProductDrawerStore } from '../../product.interface';

import { useAuth } from '@/features/auth/hooks/mutations';

interface CompoundRowActionProps {
  compound: Product;
}
export const CompoundRowAction: FC<CompoundRowActionProps> = ({ compound }) => {
  const { permissions } = useAuth();

  const { onEdit, onShow } = useProductDrawerStore();

  return (
    <Box display='flex' gap={1}>
      {permissions.includes('compounds.show') && (
        <Tooltip title='Ver'>
          <IconButton onClick={() => onShow(compound, 'Detalle Compuesto')}>
            <Eye size={18} />
          </IconButton>
        </Tooltip>
      )}
      {permissions.includes('compounds.edit') && (
        <Tooltip title='Editar'>
          <IconButton onClick={() => onEdit(compound, 'Editar Compuesto')}>
            <Pencil size={18} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
