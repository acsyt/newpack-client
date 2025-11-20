import type {
  MenuItem,
  SubMenuItem
} from '@/domain/interfaces/menu-item.interface';

import { useMemo, useCallback } from 'react';

import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

import { useAuth } from '../auth/useAuth';

import { tenant } from '@/config/utils/tenant.util';
import { Permission } from '@/domain/interfaces/role.interface';
import { routePermissions } from '@/presentation/routes/route.config';
import { FileRouteTypes } from '@/routeTree.gen';

const MENU_ORDER_CENTRAL: FileRouteTypes['fullPaths'][] = [
  '/dashboard',
  '/users'
];

const MENU_ORDER_TENANT: FileRouteTypes['fullPaths'][] = [
  '/dashboard',
  '/users'
];

const orderTopLevel = (items: MenuItem[], isTenant: boolean): MenuItem[] => {
  const MENU_ORDER = isTenant ? MENU_ORDER_TENANT : MENU_ORDER_CENTRAL;
  const ORDER_INDEX: Map<FileRouteTypes['fullPaths'], number> = new Map(
    MENU_ORDER.map((p, i) => [p, i])
  );

  const indexOf = (path?: string): number => {
    if (!path) return Number.MAX_SAFE_INTEGER - 1;
    const k = path as FileRouteTypes['fullPaths'];

    return ORDER_INDEX.has(k)
      ? (ORDER_INDEX.get(k) as number)
      : Number.MAX_SAFE_INTEGER - 1;
  };

  const sortSubmenu = (subs: SubMenuItem[]): SubMenuItem[] => {
    if (!subs?.length) return subs ?? [];

    return subs
      .map((sub, i) => {
        return { sub, i, pos: indexOf(sub.href) };
      })
      .sort((a, b) => a.pos - b.pos || a.i - b.i)
      .map(({ sub }) => sub);
  };

  return items
    .map((item, idx) => {
      const href = 'href' in item ? (item.href ?? '') : '';

      const hasChildren = 'menuItems' in item && Array.isArray(item.menuItems);
      const sortedChildren = hasChildren
        ? sortSubmenu(item.menuItems)
        : undefined;
      const minChildPos =
        hasChildren && sortedChildren!.length
          ? Math.min(...sortedChildren!.map(s => indexOf(s.href)))
          : Number.MAX_SAFE_INTEGER - 1;

      const selfPos = indexOf(href);
      const pos = Math.min(selfPos, minChildPos);

      const normalized = hasChildren
        ? { ...item, menuItems: sortedChildren! }
        : item;

      return { item: normalized, idx, pos };
    })
    .sort((a, b) => a.pos - b.pos || a.idx - b.idx)
    .map(({ item }) => item);
};

export const useMenuItems = () => {
  const { permissions } = useAuth();
  const $tenant = tenant();

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

  const filterMenuItems = useCallback(
    (items: MenuItem[], perms: Permission[]): MenuItem[] => {
      return items
        .filter(item => {
          if (!('href' in item) || !item.href) return true;
          const routePerms =
            routePermissions[item.href as keyof typeof routePermissions];

          if (routePerms && !routePerms.some(p => perms.includes(p))) {
            return false;
          }

          return true;
        })
        .map(item => {
          const newItem = { ...item };

          if ('menuItems' in newItem) {
            const filteredSubItems = newItem.menuItems.filter(subItem => {
              if (!subItem.href) return true;
              const routePerms =
                routePermissions[subItem.href as keyof typeof routePermissions];

              return !routePerms || routePerms.some(p => perms.includes(p));
            });

            return { ...newItem, menuItems: filteredSubItems };
          }

          return newItem;
        })
        .filter(item => !('menuItems' in item) || item.menuItems.length > 0);
    },
    []
  );

  const renderMenuItems = useMemo<MenuItem[]>(() => {
    const filtered = filterMenuItems(menuItems, permissions);

    return orderTopLevel(filtered, $tenant.isTenant);
  }, [filterMenuItems, menuItems, permissions, $tenant.isTenant]);

  return { renderMenuItems };
};
