import type { FC } from 'react';

import { useMemo, useState } from 'react';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import { useLocation } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';

import { MenuItem, SubMenuItem } from '@/interfaces/menu-item.interface';

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

  // Para items con dropdown, verificamos si alguno de sus hijos está activo
  const hasActiveChild = useMemo(() => {
    if (!('menuItems' in item)) return false;

    const normalizePath = (path: string) => path.split('/').filter(Boolean);
    const currentSegments = normalizePath(currentPath);

    return item.menuItems.some(subItem => {
      const subItemSegments = normalizePath(subItem.href);

      return (
        subItemSegments.length === currentSegments.length &&
        subItemSegments.every(
          (segment, index) => currentSegments[index] === segment
        )
      );
    });
  }, [currentPath, item]);

  // isSelected solo para items con href directo
  const isSelected = useMemo(() => {
    if (!('href' in item)) return false;

    const normalizePath = (path: string) => path.split('/').filter(Boolean);
    const currentSegments = normalizePath(currentPath);
    const itemSegments = normalizePath(item.href);

    const exactMatch =
      itemSegments.length === currentSegments.length &&
      itemSegments.every(
        (segment, index) => currentSegments[index] === segment
      );

    const isSubroute =
      currentSegments.length > itemSegments.length &&
      itemSegments.every(
        (segment, index) => currentSegments[index] === segment
      );

    return exactMatch || isSubroute;
  }, [currentPath, item]);

  const [isOpenMenu, setIsOpenMenu] = useState(isOpen || hasActiveChild);

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
            transition: 'all 0.3s ease',
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
            disabled={!item.isEnabled}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: `0 2px 4px ${theme.palette.grey[300]}`,
              borderRadius:
                isOpenMenu && isDashboardDrawerOpen
                  ? '16px 16px 0 0'
                  : theme.shape.borderRadius,
              bgcolor: hasActiveChild
                ? theme.palette.primary.main
                : theme.palette.background.paper,
              color: hasActiveChild
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiSvgIcon-root':
                  {
                    color: theme.palette.primary.contrastText
                  }
              },
              '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiSvgIcon-root':
                {
                  color: hasActiveChild
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary
                }
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
                textWrap: 'wrap',
                flex: 1
              }}
              primary={item.title}
            />
            {isDashboardDrawerOpen && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: 1
                }}
              >
                {isOpenMenu ? (
                  <ExpandLessIcon fontSize='small' />
                ) : (
                  <ExpandMoreIcon fontSize='small' />
                )}
              </Box>
            )}
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

  const isSelected = useMemo(() => {
    const currentSegments = currentPath.split('/').filter(Boolean);
    const itemSegments = childItem.href.split('/').filter(Boolean);

    return (
      currentSegments.length === itemSegments.length &&
      currentSegments.every((segment, index) => itemSegments[index] === segment)
    );
  }, [currentPath, childItem.href]);

  return (
    <ListItemButton
      key={childItem.title}
      disabled={!childItem.isEnabled}
      selected={isSelected}
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: `0 2px 4px ${theme.palette.grey[300]}`,
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: index === itemLength - 1 ? '0 0 16px 16px' : 0,
        transition: 'all 0.3s ease',
        '&.Mui-selected, &.Mui-selected:hover': {
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiSvgIcon-root':
            {
              color: theme.palette.primary.contrastText
            },
          '& .MuiListItemText-primary': {
            fontWeight: 600
          }
        },
        '&:hover': {
          bgcolor: theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
          '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiSvgIcon-root':
            {
              color: theme.palette.primary.contrastText
            }
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
