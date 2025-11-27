import type { MenuItem } from '@/interfaces/menu-item.interface';
import type { FC, PropsWithChildren } from 'react';

import { useEffect, useState, useRef } from 'react';

import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { Menu as MenuIcon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import { DashboardBreadcrumbs } from './DashboardBreadcrumbs';
import { DashboardSideBar } from './DashboardSideBar';

import { DASHBOARD_DRAWER_WIDTH } from '@/config/constants/app.constants';
import { cn } from '@/config/utils/cn.util';
import { useUIStore } from '@/stores/ui.store';

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

  const [isDashboardDrawerOpen, setIsDashboardDrawerOpen] = useState(isDesktop);

  const toggleDashboardDrawer = () => {
    setIsDashboardDrawerOpen(prev => !prev);
  };

  useEffect(() => {
    // Update drawer state when switching between desktop and mobile
    setIsDashboardDrawerOpen(isDesktop);
  }, [isDesktop]);

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
              className={cn(
                'flex items-center py-4',
                isDashboardDrawerOpen
                  ? 'justify-between gap-2 px-4'
                  : 'justify-center gap-0 px-0'
              )}
              sx={{
                minHeight: '80px !important'
              }}
            >
              {isDashboardDrawerOpen && (
                <Box className='flex grow justify-center'>
                  <picture className='flex justify-center'>
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
                      className='rounded w-60 h-24 object-contain'
                    />
                  </picture>
                </Box>
              )}

              <IconButton
                aria-label={isDashboardDrawerOpen ? 'Close menu' : 'Open menu'}
                className='p-2'
                sx={{
                  color: 'primary.main'
                }}
                onClick={toggleDashboardDrawer}
              >
                <MenuIcon size={24} />
              </IconButton>
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
                justifyContent: 'space-between',
                gap: 1,
                px: 2,
                py: 2,
                minHeight: '80px !important'
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center'
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

              <IconButton
                aria-label='Close menu'
                sx={{
                  color: 'primary.main'
                }}
                onClick={toggleDashboardDrawer}
              >
                <MenuIcon size={24} />
              </IconButton>
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
            height: '100%',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          {!isDesktop && (
            <Box sx={{ mb: 2 }}>
              <IconButton
                aria-label='Open menu'
                sx={{
                  color: 'primary.main'
                }}
                onClick={toggleDashboardDrawer}
              >
                <MenuIcon size={24} />
              </IconButton>
            </Box>
          )}

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
