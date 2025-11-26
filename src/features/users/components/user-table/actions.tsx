import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from '@tanstack/react-router';

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
                <VisibilityIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {permissions.includes('users.edit') && (
          <Tooltip title={'Edit'}>
            <Link to='/users/$userId/edit' params={{ userId: String(user.id) }}>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}
      </Box>
    </>
  );
};
