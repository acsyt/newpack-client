import type { FC } from 'react';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import { useLocation } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';

import { MenuItem, SubMenuItem } from '@/domain/interfaces/menu-item.interface';

interface DashboardListItemProps {
  item: MenuItem;
  isDashboardDrawerOpen: boolean;
  isOpen: boolean;
}

export const DashboardListItem: FC<DashboardListItemProps> = ({
  item,
  isDashboardDrawerOpen,
  isOpen
}) => {
  const theme = useTheme();

  const location = useLocation();

  const currentPath = location.pathname;

  const isSelected = useMemo(() => {
    const normalizePath = (path: string) => path.split('/').filter(Boolean);
    const currentSegments = normalizePath(currentPath);

    // Función para verificar si una ruta es la activa o es padre de la activa
    const isActiveRoute = (routeSegments: string[]) => {
      // Coincidencia exacta - misma cantidad de segmentos y todos coinciden
      const exactMatch =
        routeSegments.length === currentSegments.length &&
        routeSegments.every(
          (segment, index) => currentSegments[index] === segment
        );

      // Coincidencia parcial - la ruta actual comienza con esta ruta (es una subruta)
      const isSubroute =
        currentSegments.length > routeSegments.length &&
        routeSegments.every(
          (segment, index) => currentSegments[index] === segment
        );

      return exactMatch || isSubroute;
    };

    // Si es un elemento con enlace directo
    if ('href' in item) {
      const itemSegments = normalizePath(item.href);

      return isActiveRoute(itemSegments);
    }

    // Si es un elemento con submenú
    if ('menuItems' in item) {
      return item.menuItems.some(subItem => {
        const subItemSegments = normalizePath(subItem.href);

        return isActiveRoute(subItemSegments);
      });
    }

    return false;
  }, [currentPath, item]);

  const [isOpenMenu, setIsOpenMenu] = useState(isOpen || isSelected);

  const onToggleMenu = () => {
    if (!isDashboardDrawerOpen) return;
    setIsOpenMenu(!isOpenMenu);
  };

  return (
    <Box>
      {'href' in item ? (
        <ListItemButton
          component={Link}
          selected={isSelected}
          aria-label={item.title.toLowerCase().split(' ').join('-')}
          to={item.href}
          disabled={!item.isEnabled}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            borderRadius: theme.shape.borderRadius,
            boxShadow: `0 2px 4px ${theme.palette.grey[300]}`,
            transition: 'border-radius 0.3s ease, box-shadow 0.3s ease',
            '&.Mui-selected, &.Mui-selected:hover': {
              bgcolor: theme.palette.primary.main,
              '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiSvgIcon-root':
                {
                  color: theme.palette.primary.contrastText
                }
            },
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
              '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiSvgIcon-root':
                {
                  color: theme.palette.primary.contrastText
                }
            },
            maxHeight: 48
          }}
        >
          <ListItemIcon
            sx={{ py: 0, mb: 0, minWidth: isDashboardDrawerOpen ? 40 : 0 }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            sx={{
              opacity: isDashboardDrawerOpen ? 1 : 0,
              textWrap: 'wrap'
            }}
            primary={item.title}
          />
        </ListItemButton>
      ) : (
        <>
          <ListItemButton
            selected={isSelected}
            disabled={!item.isEnabled}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              transition: 'border-radius 0.3s ease, box-shadow 0.3s ease',
              '&.Mui-selected, &.Mui-selected:hover': {
                bgcolor: theme.palette.primary.main,
                '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiSvgIcon-root':
                  {
                    color: theme.palette.primary.contrastText
                  }
              },
              '&:hover': {
                bgcolor: isOpenMenu
                  ? theme.palette.primary.dark
                  : theme.palette.primary.main,
                '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiSvgIcon-root':
                  {
                    color: theme.palette.primary.contrastText
                  }
              },
              ...(isOpenMenu && isDashboardDrawerOpen
                ? {
                    boxShadow: `0 2px 4px ${theme.palette.grey[300]}`,
                    borderBottom: 'none',
                    borderRadius: '16px 16px 0 0',
                    bgcolor: theme.palette.primary.main,
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiSvgIcon-root':
                      {
                        color: theme.palette.primary.contrastText
                      }
                  }
                : {
                    boxShadow: `0 2px 4px ${theme.palette.grey[300]}`,
                    borderRadius: theme.shape.borderRadius
                  })
            }}
            onClick={onToggleMenu}
          >
            <ListItemIcon
              sx={{ py: 0, mb: 0, minWidth: isDashboardDrawerOpen ? 40 : 0 }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              sx={{
                opacity: isDashboardDrawerOpen ? 1 : 0,
                textWrap: 'wrap'
              }}
              primary={item.title}
            />
          </ListItemButton>
          <Collapse
            unmountOnExit
            in={isOpenMenu && isDashboardDrawerOpen}
            timeout='auto'
            sx={{ mb: 1 }}
          >
            {'menuItems' in item && item.menuItems.length > 0
              ? item.menuItems.map((childItem, index) => (
                  <ChildMenuItem
                    key={childItem.title}
                    childItem={childItem}
                    isDashboardDrawerOpen={isDashboardDrawerOpen}
                    currentPath={currentPath}
                    index={index}
                    itemLength={item.menuItems.length}
                  />
                ))
              : null}
          </Collapse>
        </>
      )}
    </Box>
  );
};

interface ChildMenuItemProps {
  childItem: SubMenuItem;
  isDashboardDrawerOpen: boolean;
  currentPath: string;
  index: number;
  itemLength: number;
}

const ChildMenuItem: FC<ChildMenuItemProps> = ({
  childItem,
  isDashboardDrawerOpen,
  currentPath,
  index,
  itemLength
}) => {
  const theme = useTheme();

  return (
    <ListItemButton
      key={childItem.title}
      disabled={!childItem.isEnabled}
      sx={{
        bgcolor: (() => {
          const currentSegments = currentPath.split('/').filter(Boolean);
          const itemSegments = childItem.href.split('/').filter(Boolean);

          const exactMatch =
            currentSegments.length === itemSegments.length &&
            currentSegments.every(
              (segment, index) => itemSegments[index] === segment
            );

          return exactMatch
            ? theme.palette.primary.dark
            : theme.palette.primary.main;
        })(),
        color: theme.palette.primary.contrastText,
        boxShadow: `0 2px 4px ${theme.palette.grey[300]}`,
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: index === itemLength - 1 ? '0 0 16px 16px' : 0,
        transition: 'border-radius 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          bgcolor: theme.palette.primary.dark
        }
      }}
      component={Link}
      aria-label={childItem.title.toLowerCase().split(' ').join('-')}
      to={childItem.href}
    >
      <ListItemText
        primary={childItem.title}
        sx={{
          opacity: isDashboardDrawerOpen ? 1 : 0,
          textWrap: 'wrap'
        }}
      />
    </ListItemButton>
  );
};
