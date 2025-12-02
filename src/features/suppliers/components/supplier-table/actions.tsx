import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from '@tanstack/react-router';
import { Eye, Pencil } from 'lucide-react';

import { useAuth } from '@/features/auth/hooks/mutations';
import { Supplier } from '@/features/suppliers/supplier.interface';

export const RowActions = ({ supplier }: { supplier: Supplier }) => {
  const { permissions } = useAuth();

  return (
    <>
      <Box display='flex' gap={1}>
        {permissions.includes('suppliers.show') && (
          <Tooltip title='Show'>
            <Link
              to='/suppliers/$supplierId/show'
              params={{ supplierId: String(supplier.id) }}
            >
              <IconButton>
                <Eye size={18} />
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {permissions.includes('suppliers.edit') && (
          <Tooltip title={'Edit'}>
            <Link
              to='/suppliers/$supplierId/edit'
              params={{ supplierId: String(supplier.id) }}
            >
              <IconButton>
                <Pencil size={18} />
              </IconButton>
            </Link>
          </Tooltip>
        )}
      </Box>
    </>
  );
};
