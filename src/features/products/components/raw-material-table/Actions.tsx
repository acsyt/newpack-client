import { FC } from 'react';

import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Eye, Pencil } from 'lucide-react';

import { Product } from '../../product.interface';

import { useRawMaterialDrawerStore } from '@/app/_authenticated/raw-materials';
import { useAuth } from '@/features/auth/hooks/mutations';

interface RawMaterialRowActionProps {
  rawMaterial: Product;
}
export const RawMaterialRowAction: FC<RawMaterialRowActionProps> = ({
  rawMaterial
}) => {
  const { permissions } = useAuth();

  const { onEdit, onShow } = useRawMaterialDrawerStore();

  return (
    <Box display='flex' gap={1}>
      {permissions.includes('raw-materials.show') && (
        <Tooltip title='Ver'>
          <IconButton onClick={() => onShow(rawMaterial)}>
            <Eye size={18} />
          </IconButton>
        </Tooltip>
      )}
      {permissions.includes('raw-materials.edit') && (
        <Tooltip title='Editar'>
          <IconButton onClick={() => onEdit(rawMaterial)}>
            <Pencil size={18} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
