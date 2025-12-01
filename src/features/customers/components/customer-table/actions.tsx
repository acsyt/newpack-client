import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from '@tanstack/react-router';
import { Eye, Pencil } from 'lucide-react';

import { useAuth } from '@/features/auth/hooks/mutations';
import { Customer } from '@/features/customers/customer.interface';

export const RowActions = ({ customer }: { customer: Customer }) => {
  const { permissions } = useAuth();

  return (
    <>
      <Box display='flex' gap={1}>
        {permissions.includes('users.show') && (
          <Tooltip title='Show'>
            <Link to='/customers/$customerId/show' params={{ customerId: String(customer.id) }}>
              <IconButton>
                <Eye size={18} />
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {permissions.includes('users.edit') && (
          <Tooltip title={'Edit'}>
            <Link to='/customers/$customerId/edit' params={{ customerId: String(customer.id) }}>
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
