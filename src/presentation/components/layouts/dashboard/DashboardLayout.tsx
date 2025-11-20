import type { MenuItem } from '@/domain/interfaces/menu-item.interface';
import type { FC, PropsWithChildren } from 'react';

import { useEffect, useState, useRef } from 'react';

import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { useInView } from 'react-intersection-observer';

import { DashboardAppBar } from './DashboardAppBar';
import { DashboardBreadcrumbs } from './DashboardBreadcrumbs';
import { DashboardSideBar } from './DashboardSideBar';

import { DASHBOARD_DRAWER_WIDTH } from '@/config/constants/app.constants';
import { useUIStore } from '@/presentation/stores/ui.store';

interface DashboardLayoutProps {
  menuItems: MenuItem[];
}

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: DASHBOARD_DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    })
  }
}));

export const DashboardLayout: FC<PropsWithChildren<DashboardLayoutProps>> = ({
  children,
  menuItems
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { setScrollContainer, setDrawerOpen } = useUIStore();

  const [isDashboardDrawerOpen, setIsDashboardDrawerOpen] = useState(true);

  const toggleDashboardDrawer = () => {
    setIsDashboardDrawerOpen(prev => !prev);
  };

  useEffect(() => {
    setDrawerOpen(isDashboardDrawerOpen);
  }, [isDashboardDrawerOpen, setDrawerOpen]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  const { ref: topSentinelRef } = useInView({
    root: rootEl,
    threshold: 0
  });

  useEffect(() => {
    setRootEl(scrollRef.current);
    setScrollContainer(scrollRef.current);
  }, [setScrollContainer]);

  return (
    <>
      <Box display='flex' height='100dvh' overflow='hidden'>
        <DashboardAppBar
          open={isDashboardDrawerOpen}
          toggleDrawer={toggleDashboardDrawer}
        />
        {isDesktop ? (
          <StyledDrawer
            variant='permanent'
            open={isDashboardDrawerOpen}
            aria-label={'Navigation Menu'}
            sx={{
              height: '100%',
              '& .MuiDrawer-paper': {
                position: 'relative',
                height: '100%',
                overflow: 'hidden'
              }
            }}
          >
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1]
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  my: 2
                }}
              >
                <picture className='flex justify-center'>
                  <source
                    srcSet={'/assets/images/logo-full.avif'}
                    type='image/avif'
                  />
                  <source
                    srcSet={'/assets/images/logo-full.webp'}
                    type='image/webp'
                  />
                  <Box
                    component={'img'}
                    loading='lazy'
                    src={'/assets/images/logo-full.png'}
                    alt={'Logo'}
                    className='rounded w-60 h-24 object-contain'
                  />
                </picture>
              </Box>
            </Toolbar>
            <DashboardSideBar
              menuItems={menuItems}
              isDashboardDrawerOpen={isDashboardDrawerOpen}
            />
          </StyledDrawer>
        ) : (
          <Drawer
            variant='temporary'
            open={isDashboardDrawerOpen}
            aria-label={'Navigation Menu'}
            sx={{
              zIndex: 1300,
              '& .MuiDrawer-paper': {
                width: DASHBOARD_DRAWER_WIDTH,
                height: '100%',
                overflow: 'hidden',
                zIndex: 1300
              },
              '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1299
              }
            }}
            ModalProps={{
              keepMounted: true
            }}
            onClose={toggleDashboardDrawer}
          >
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
                position: 'relative',
                zIndex: 1301
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  my: 2,
                  position: 'relative',
                  zIndex: 1302
                }}
              >
                <picture>
                  <source
                    srcSet={'/assets/images/logo.avif'}
                    type='image/avif'
                  />
                  <source
                    srcSet={'/assets/images/logo.webp'}
                    type='image/webp'
                  />
                  <Box
                    component={'img'}
                    loading='lazy'
                    src={'/assets/images/logo.png'}
                    alt={'Logo'}
                    className='rounded w-16 h-16 object-contain'
                  />
                </picture>
              </Box>
            </Toolbar>
            <DashboardSideBar
              menuItems={menuItems}
              isDashboardDrawerOpen={true}
            />
          </Drawer>
        )}

        <Box
          ref={scrollRef}
          sx={{
            flexGrow: 1,
            p: { xs: 1, sm: 2, md: 3 },
            width: isDesktop
              ? { sm: `calc(100% - ${DASHBOARD_DRAWER_WIDTH}px)` }
              : '100%',
            height: '100%',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          <Toolbar />
          <div ref={topSentinelRef} aria-hidden style={{ height: 1 }} />

          <Grid container spacing={1}>
            <Grid size={12}>
              <DashboardBreadcrumbs />
            </Grid>
            <Grid size={12}>
              <Box component='main'>{children}</Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
