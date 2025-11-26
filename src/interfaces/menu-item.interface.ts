import type { FileRouteTypes } from '@/routeTree.gen';
import type { JSX } from 'react';

type BaseMenuItem = {
  title: string;
  isEnabled: boolean;
};

export type MenuItemLink = BaseMenuItem & {
  icon: JSX.Element;
  href: FileRouteTypes['fullPaths'];
};

export type SubMenuItem = BaseMenuItem & {
  icon: JSX.Element;
  href: FileRouteTypes['fullPaths'];
};

export type MenuItemDropdown = BaseMenuItem & {
  icon: JSX.Element;
  menuItems: SubMenuItem[];
};

export type MenuItem = MenuItemLink | MenuItemDropdown;
