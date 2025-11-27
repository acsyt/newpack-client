import type { MenuItem } from '@/interfaces/menu-item.interface';

import { useMemo } from 'react';

import {
  Box,
  Building2,
  ChartBarStacked,
  LayoutDashboard,
  Shield,
  UserCheckIcon,
  Users
} from 'lucide-react';

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
        title: 'Usuarios',
        icon: <Users aria-hidden='true' size={20} />,
        href: '/users',
        isEnabled: true
      },
      {
        title: 'Roles',
        icon: <Shield aria-hidden='true' size={20} />,
        href: '/roles',
        isEnabled: true
      },
      {
        title: 'Catálogos',
        icon: <ChartBarStacked aria-hidden='true' size={20} />,
        isEnabled: true,
        menuItems: [
          {
            title: 'Procesos',
            href: '/processes',
            isEnabled: true,
            icon: <ChartBarStacked aria-hidden='true' size={20} />
          },
          {
            title: 'Clases',
            href: '/classes',
            isEnabled: true,
            icon: <ChartBarStacked aria-hidden='true' size={20} />
          },
          {
            title: 'Subclases',
            href: '/subclasses',
            isEnabled: true,
            icon: <ChartBarStacked aria-hidden='true' size={20} />
          },
          {
            title: 'Maquinas',
            href: '/machines',
            isEnabled: true,
            icon: <ChartBarStacked aria-hidden='true' size={20} />
          }
        ]
      },
      {
        title: 'Materias Primas',
        icon: <Box aria-hidden='true' size={20} />,
        href: '/raw-materials',
        isEnabled: true
      },
      {
        title: 'Clientes',
        icon: <UserCheckIcon aria-hidden='true' size={20} />,
        href: '/customers',
        isEnabled: true
      },
      {
        title: 'Proveedores',
        icon: <Building2 aria-hidden='true' size={20} />,
        href: '/suppliers',
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
