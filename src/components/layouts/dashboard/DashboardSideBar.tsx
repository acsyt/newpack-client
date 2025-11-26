import type { FC } from 'react';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { useLocation } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

import { DashboardListItem } from './DashboardListItem';

import { useLogout } from '@/features/auth/hooks/mutations';
import { MenuItem } from '@/interfaces/menu-item.interface';

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
  const logoutMutation = useLogout();

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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100% - 80px)',
        overflow: 'hidden'
      }}
    >
      <List
        disablePadding
        component='nav'
        sx={{
          px: isDashboardDrawerOpen ? 2 : 1,
          mt: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          flexGrow: 1,
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

      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ px: isDashboardDrawerOpen ? 2 : 1, pb: 2 }}>
          <Button
            fullWidth
            variant='outlined'
            color='primary'
            startIcon={isDashboardDrawerOpen ? <LogOut size={18} /> : undefined}
            disabled={logoutMutation.isPending}
            sx={{
              justifyContent: 'center',
              minWidth: isDashboardDrawerOpen ? 'auto' : '48px',
              px: isDashboardDrawerOpen ? 2 : 0,
              display: 'flex',
              alignItems: 'center'
            }}
            onClick={handleLogout}
          >
            {isDashboardDrawerOpen ? 'Cerrar sesión' : <LogOut size={18} />}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
