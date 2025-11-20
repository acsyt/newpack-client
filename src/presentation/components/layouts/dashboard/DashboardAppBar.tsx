import type { AppBarProps } from '@mui/material/AppBar';
import type { FC } from 'react';

import { useEffect, useRef, useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { create } from 'zustand';

import { UserMenu } from './menus/UserMenu';

import { DASHBOARD_DRAWER_WIDTH } from '@/config/constants/app.constants';
import { FontWeight } from '@/presentation/theme/font-weight';

interface AppBarStore {
  appBarHeight: number;
  appBarRef: HTMLElement | null;

  setAppBarHeight: (height: number) => void;
  setAppBarRef: (ref: HTMLElement) => void;
}

export const useAppBarStore = create<AppBarStore>(set => ({
  appBarHeight: 0,
  appBarRef: null,
  setAppBarHeight: height => set({ appBarHeight: height }),
  setAppBarRef: ref => set({ appBarRef: ref })
}));

interface DashboardAppBarProps {
  open: boolean;
  toggleDrawer: () => void;
}

interface StyledAppBarProps extends AppBarProps {
  open?: boolean;
}

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: prop => prop !== 'open'
})<StyledAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  [theme.breakpoints.up('md')]: {
    ...(open && {
      marginLeft: DASHBOARD_DRAWER_WIDTH,
      width: `calc(100% - ${DASHBOARD_DRAWER_WIDTH}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    width: '100%'
  }
}));

export const DashboardAppBar: FC<DashboardAppBarProps> = ({
  open,
  toggleDrawer
}) => {
  const { setAppBarHeight, setAppBarRef } = useAppBarStore();

  const theme = useTheme();

  const [userMenu, setUserMenu] = useState<null | HTMLElement>(null);

  const onOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    setUserMenu(event.currentTarget);

  const onCloseUserMenu = () => setUserMenu(null);

  const appBarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!appBarRef.current) return;

    const element = appBarRef.current;

    setAppBarRef(element);

    const updateHeight = () => {
      const height = element.getBoundingClientRect().height;

      setAppBarHeight(height);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [setAppBarHeight, setAppBarRef]);

  return (
    <>
      <StyledAppBar ref={appBarRef} position='absolute' open={open}>
        <Toolbar sx={{ pr: '24px' }}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label={open ? 'Close' : 'Open'}
            sx={{
              marginRight: 1,
              pointerEvents: 'auto',
              zIndex: theme.zIndex.appBar + 1
            }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            noWrap
            component='h1'
            variant='h6'
            color='inherit'
            sx={{ flexGrow: 1 }}
            fontWeight={FontWeight.semiBold}
          >
            ACSYT
          </Typography>

          <Box display={'flex'} gap={1} alignItems='center'>
            <Divider
              flexItem
              orientation='vertical'
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
            />
            <IconButton color='inherit' onClick={onOpenUserMenu}>
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>
      <UserMenu userMenu={userMenu} onCloseUserMenu={onCloseUserMenu} />
    </>
  );
};
