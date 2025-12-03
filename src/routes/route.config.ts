import type { FileRouteTypes } from '@/routeTree.gen';

import { useLocation } from '@tanstack/react-router';

import { SessionUser } from '@/features/auth/session-user.interface';
import { Permission } from '@/features/roles/role.interface';

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
  | '/roles/$roleId'
  | '/suppliers/$supplierId'
>;

export const hasRoleAccess = (path: string): boolean => {
  const roleRoutes = ['admin'];

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
  '/users/$userId/show': ['users.show'],
  '/classes': ['classes.index'],
  '/customers': ['customers.index'],
  '/customers/create': ['customers.create'],
  '/customers/$customerId/edit': ['customers.edit'],
  '/customers/$customerId/show': ['customers.show'],
  '/machines': ['machines.index'],
  '/processes': ['processes.index'],
  '/raw-materials': ['raw-materials.index'],
  '/roles': ['roles.index'],
  '/suppliers': ['suppliers.index'],
  '/suppliers/$supplierId/edit': ['suppliers.edit'],
  '/suppliers/create': ['suppliers.create'],
  '/suppliers/$supplierId/show': ['suppliers.show'],
  '/subclasses': ['subclasses.index'],
  '/warehouses': ['warehouses.index'],
  '/inventory-movements': ['inventory-movements.index'],
  '/inventory-stocks': ['inventory-stocks.index'],
  '/currencies': ['currencies.index'],
  '/roles/$roleId/edit': ['roles.edit'],
  '/roles/create': ['roles.create'],
  '/roles/$roleId/show': ['roles.show'],
  '/compounds': ['compounds.index'],
  '/purchase-orders': ['purchase-orders.index'],
  '/processes/bolsa-en-rollo': ['processes.bolsa-en-rollo.index'],
  '/processes/bolsa-suelta': ['processes.bolsa-suelta.index'],
  '/processes/extrusion': ['processes.extrusion.index'],
  '/processes/impresion': ['processes.impresion.index'],
  '/processes/peletizado': ['processes.peletizado.index'],
  '/inventory-movements/create-transfer': [
    'inventory-movements.create-transfer'
  ]
};

export const useRouteConfig = () => {
  const pathname = useLocation().pathname;

  const dashboardRoutes: Record<DashboardRoutes, RouteMetadata> = {
    '/dashboard': {
      title: 'Panel',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Panel' }]
    },
    '/users': {
      title: 'Listado de Usuarios',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Usuarios' }]
    },
    '/users/create': {
      title: 'Crear Usuario',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Usuarios', path: '/users' },
        { title: 'Crear' }
      ]
    },
    '/users/$userId/edit': {
      title: 'Editar Usuario',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Usuarios', path: '/users' },
        { title: ':id' },
        { title: 'Editar' }
      ]
    },
    '/users/$userId/show': {
      title: 'Detalle Usuario',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Usuarios', path: '/users' },
        { title: ':id' },
        { title: 'Detalle' }
      ]
    },
    '/classes': {
      title: 'Listado de Clases',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Clases' }]
    },
    '/subclasses': {
      title: 'Listado de Subclases',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Subclases' }]
    },
    '/customers': {
      title: 'Listado de Clientes',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Clientes' }]
    },
    '/customers/create': {
      title: 'Crear Cliente',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Clientes', path: '/customers' },
        { title: 'Crear' }
      ]
    },
    '/customers/$customerId/edit': {
      title: 'Editar Cliente',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Clientes', path: '/customers' },
        { title: ':id' },
        { title: 'Editar' }
      ]
    },
    '/customers/$customerId/show': {
      title: 'Detalle Cliente',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Clientes', path: '/customers' },
        { title: ':id' },
        { title: 'Detalle' }
      ]
    },
    '/machines': {
      title: 'Listado de Máquinas',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Máquinas' }]
    },
    '/processes': {
      title: 'Listado de Procesos',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Procesos' }]
    },
    '/raw-materials': {
      title: 'Listado de Materias Primas',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Materias Primas' }
      ]
    },
    '/compounds': {
      title: 'Listado de Compuestos',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Compuestos' }]
    },
    '/suppliers': {
      title: 'Listado de Proveedores',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Proveedores' }]
    },
    '/suppliers/create': {
      title: 'Crear Proveedor',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Proveedores', path: '/suppliers' },
        { title: 'Crear' }
      ]
    },
    '/suppliers/$supplierId/edit': {
      title: 'Editar Proveedor',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Proveedores', path: '/suppliers' },
        { title: ':id' },
        { title: 'Editar' }
      ]
    },
    '/suppliers/$supplierId/show': {
      title: 'Detalle Proveedor',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Proveedores', path: '/suppliers' },
        { title: ':id' },
        { title: 'Detalle' }
      ]
    },
    '/warehouses': {
      title: 'Listado de Almacenes',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Almacenes' }]
    },
    '/inventory-movements': {
      title: 'Listado de Movimientos',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Movimientos' }]
    },
    '/inventory-stocks': {
      title: 'Listado de Existencias',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Existencias' }]
    },
    '/currencies': {
      title: 'Tipos de Monedas',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Tipos de Monedas' }
      ]
    },
    '/roles': {
      title: 'Listado de Roles',
      breadcrumbs: [{ title: 'Inicio', path: '/' }, { title: 'Roles' }]
    },
    '/roles/create': {
      title: 'Crear Rol',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Roles', path: '/roles' },
        { title: 'Crear' }
      ]
    },
    '/roles/$roleId/edit': {
      title: 'Editar Rol',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Roles', path: '/roles' },
        { title: ':id' },
        { title: 'Editar' }
      ]
    },
    '/roles/$roleId/show': {
      title: 'Detalle Rol',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Roles', path: '/roles' },
        { title: ':id' },
        { title: 'Detalle' }
      ]
    },
    '/processes/bolsa-en-rollo': {
      title: 'Proceso: Bolsa en Rollo',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Procesos', path: '/processes' },
        { title: 'Bolsa en Rollo' }
      ]
    },
    '/processes/bolsa-suelta': {
      title: 'Proceso: Bolsa Suelta',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Procesos', path: '/processes' },
        { title: 'Bolsa Suelta' }
      ]
    },
    '/processes/extrusion': {
      title: 'Proceso: Extrusión',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Procesos', path: '/processes' },
        { title: 'Extrusión' }
      ]
    },
    '/processes/impresion': {
      title: 'Proceso: Impresión',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Procesos', path: '/processes' },
        { title: 'Impresión' }
      ]
    },
    '/processes/peletizado': {
      title: 'Proceso: Peletizado',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Procesos', path: '/processes' },
        { title: 'Peletizado' }
      ]
    },
    '/purchase-orders': {
      title: 'Listado de Órdenes de Compra',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Órdenes de Compra' }
      ]
    },
    '/inventory-movements/create-transfer': {
      title: 'Nueva Transferencia',
      breadcrumbs: [
        { title: 'Inicio', path: '/' },
        { title: 'Movimientos', path: '/inventory-movements' },
        { title: 'Crear Transferencia' }
      ]
    }
  };

  const currentRoute = findRoute(dashboardRoutes, pathname);

  return { dashboardRoutes, currentRoute };
};
