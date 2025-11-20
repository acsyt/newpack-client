import type { FC } from 'react';

import { useCallback } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useAuthContext } from '@/presentation/context/auth/AuthProvider';

interface UserMenuProps {
  userMenu: null | HTMLElement;
  onCloseUserMenu: () => void;
}

export const UserMenu: FC<UserMenuProps> = ({ userMenu, onCloseUserMenu }) => {
  const { logoutMutation } = useAuthContext();

  const close = useCallback(() => {
    onCloseUserMenu();
    logoutMutation.mutate();
  }, [logoutMutation, onCloseUserMenu]);

  return (
    <Menu
      anchorEl={userMenu}
      open={Boolean(userMenu)}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onCloseUserMenu}
    >
      <MenuItem onClick={close}>Logout</MenuItem>
    </Menu>
  );
};
