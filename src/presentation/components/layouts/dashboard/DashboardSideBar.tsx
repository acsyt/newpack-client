import type { FC } from 'react';

import { useEffect, useState } from 'react';

import List from '@mui/material/List';
import { useLocation } from '@tanstack/react-router';

import { DashboardListItem } from './DashboardListItem';

import { MenuItem } from '@/domain/interfaces/menu-item.interface';

interface DashboardSideBarProps {
  menuItems: MenuItem[];
  isDashboardDrawerOpen: boolean;
}

export const DashboardSideBar: FC<DashboardSideBarProps> = ({
  menuItems,
  isDashboardDrawerOpen
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const findMenuItemIndex = (items: MenuItem[]): number | null => {
      const index = items.findIndex(item =>
        'href' in item
          ? item.href === currentPath
          : item.menuItems.some(subItem => subItem.href === currentPath)
      );

      return index !== -1 ? index : null;
    };
    const matchedIndex = findMenuItemIndex(menuItems);

    setOpenIndex(matchedIndex !== null ? matchedIndex : 0);
  }, [currentPath, menuItems]);

  return (
    <List
      disablePadding
      component='nav'
      sx={{
        px: isDashboardDrawerOpen ? 2 : 1,
        mt: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: 'calc(100% - 64px)',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {menuItems.map((item, index) => (
        <DashboardListItem
          key={item.title}
          item={item}
          isDashboardDrawerOpen={isDashboardDrawerOpen}
          isOpen={index === openIndex}
        />
      ))}
    </List>
  );
};
