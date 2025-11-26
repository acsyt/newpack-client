import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from '@tanstack/react-router';
import { Eye, Pencil } from 'lucide-react';

import { useAuth } from '@/features/auth/hooks/mutations';
import { User } from '@/features/users/user.interface';

export const RowActions = ({ user }: { user: User }) => {
  const { permissions } = useAuth();

  return (
    <>
      <Box display='flex' gap={1}>
        {permissions.includes('users.show') && (
          <Tooltip title='Show'>
            <Link to='/users/$userId/show' params={{ userId: String(user.id) }}>
              <IconButton>
                <Eye size={18} />
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {permissions.includes('users.edit') && (
          <Tooltip title={'Edit'}>
            <Link to='/users/$userId/edit' params={{ userId: String(user.id) }}>
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
