import type { MenuItem } from '@/interfaces/menu-item.interface';

import { useMemo } from 'react';

import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

export const useMenuItems = () => {
  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        title: 'Dashboard',
        icon: <DashboardIcon aria-hidden='true' fontSize='medium' />,
        href: '/dashboard',
        isEnabled: true
      },
      {
        title: 'Users',
        icon: <SupervisedUserCircleIcon aria-hidden='true' fontSize='medium' />,
        href: '/users',
        isEnabled: true
      }
    ],
    []
  );

  const renderMenuItems = useMemo<MenuItem[]>(() => {
    return menuItems;
  }, [menuItems]);

  return { renderMenuItems };
};
