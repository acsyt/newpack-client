import type { MenuItem } from '@/interfaces/menu-item.interface';

import { useMemo } from 'react';

import { LayoutDashboard, Users } from 'lucide-react';

export const useMenuItems = () => {
  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        title: 'Dashboard',
        icon: <LayoutDashboard aria-hidden='true' size={20} />,
        href: '/dashboard',
        isEnabled: true
      },
      {
        title: 'Users',
        icon: <Users aria-hidden='true' size={20} />,
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
