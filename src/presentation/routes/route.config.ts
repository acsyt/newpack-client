import type { Permission } from '@/domain/interfaces/role.interface';
import type { FileRouteTypes } from '@/routeTree.gen';

import { useLocation } from '@tanstack/react-router';

import {
  SessionUser,
  SessionUserType
} from '@/domain/interfaces/session-user.interface';

export interface RouteBreadcrumb {
  title: ':id' | string;
  path?: FileRouteTypes['fullPaths'];
}

export interface RouteMetadata {
  title: string;
  breadcrumbs: RouteBreadcrumb[];
}

export type DashboardRoutes = Exclude<
  FileRouteTypes['fullPaths'],
  | ''
  | '/'
  | '/auth'
  | '/auth/login'
  | '/signup'
  | '/auth/forgot-password'
  | '/auth/reset-password'
  | '/users/$userId'
>;

export const roleSpecificRoutes: Record<
  SessionUserType,
  FileRouteTypes['fullPaths'][]
> = {
  [SessionUserType.CentralUser]: [],
  [SessionUserType.TenantUser]: []
};

export const hasRoleAccess = (
  userType: SessionUserType,
  path: string
): boolean => {
  const roleRoutes = roleSpecificRoutes[userType];

  if (!roleRoutes || roleRoutes.length === 0) return false;

  return roleRoutes.some(route => {
    if (path === '/' && route === '/') return true;
    const pattern = new RegExp(`^${route.replace(/\/\$[^/]+/g, '/[^/]+')}$`);

    return pattern.test(path);
  });
};

export const getDefaultRouteByUser = (
  _user: SessionUser,
  permissions: Permission[]
): FileRouteTypes['to'] => {
  return permissions.includes('dashboard.index') ? '/dashboard' : '/';
};

export const findRoute = <T>(
  routes: Record<string, T>,
  path: string
): T | undefined => {
  if (routes[path as DashboardRoutes]) return routes[path as DashboardRoutes];

  return Object.entries(routes).find(([routePath]) => {
    const pattern = new RegExp(
      `^${routePath.replace(/\/\$[^/]+/g, '/[^/]+')}$`
    );

    return pattern.test(path);
  })?.[1];
};

export const getRoutePattern = <T>(
  routes: Record<string, T>,
  path: string
): DashboardRoutes | undefined => {
  return Object.keys(routes).find(routePath => {
    const pattern = new RegExp(
      `^${routePath.replace(/\/\$[^/]+/g, '/[^/]+')}$`
    );

    return pattern.test(path);
  }) as DashboardRoutes | undefined;
};

export const checkPermission = (
  userPermissions: Permission[],
  routePath: string
): boolean => {
  const routePattern = getRoutePattern(routePermissions, routePath);

  if (!routePattern) return true;
  const requiredPermissions = routePermissions[routePattern];

  if (!requiredPermissions) return true;

  return requiredPermissions.some(p => userPermissions.includes(p));
};

export const routePermissions: Record<DashboardRoutes, Permission[]> = {
  '/dashboard': ['dashboard.index'],
  '/users': ['users.index'],
  '/users/create': ['users.create'],
  '/users/$userId/edit': ['users.edit'],
  '/users/$userId/show': ['users.show']
};

export const useRouteConfig = () => {
  const pathname = useLocation().pathname;

  const dashboardRoutes: Record<DashboardRoutes, RouteMetadata> = {
    '/dashboard': {
      title: 'Dashboard',
      breadcrumbs: [
        {
          title: 'Home',
          path: '/'
        },
        {
          title: 'Dashboard'
        }
      ]
    },
    '/users': {
      title: 'Users',
      breadcrumbs: [{ title: 'Home', path: '/' }, { title: 'Users' }]
    },
    '/users/create': {
      title: 'Create User',
      breadcrumbs: [
        { title: 'Home', path: '/' },
        { title: 'Users', path: '/users' },
        { title: 'Create' }
      ]
    },
    '/users/$userId/edit': {
      title: 'Edit User',
      breadcrumbs: [
        { title: 'Home', path: '/' },
        { title: 'Users', path: '/users' },
        { title: ':id' },
        { title: 'Edit' }
      ]
    },
    '/users/$userId/show': {
      title: 'Show User',
      breadcrumbs: [
        { title: 'Home', path: '/' },
        { title: 'Users', path: '/users' },
        { title: ':id' },
        { title: 'Show' }
      ]
    }
  };

  const currentRoute = findRoute(dashboardRoutes, pathname);

  return { dashboardRoutes, currentRoute };
};
