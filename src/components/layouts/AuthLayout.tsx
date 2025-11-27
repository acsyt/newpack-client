import type { FC, PropsWithChildren } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

interface AuthLayoutProps {
  layoutVariant?: 'default' | 'content-first' | 'vertical';
}

export const AuthLayout: FC<PropsWithChildren<AuthLayoutProps>> = ({
  children,
  layoutVariant
}) => {
  const renderLayout = () => {
    switch (layoutVariant) {
      case 'content-first':
        return (
          <Grid container spacing={4} alignItems='stretch'>
            <Grid size={{ xs: 12, md: 6 }}>{children}</Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2
              }}
            >
              <LogoContainer />
            </Grid>
          </Grid>
        );

      case 'vertical':
        return (
          <Grid container spacing={4} direction='column' alignItems='center'>
            <Grid size={12} sx={{ textAlign: 'center' }}>
              <LogoContainer />
            </Grid>
            <Grid size={12} sx={{ width: '100%', maxWidth: 480 }}>
              {children}
            </Grid>
          </Grid>
        );

      default: // 'default'
        return (
          <Grid container spacing={4} alignItems='center'>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2
              }}
            >
              <LogoContainer />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>{children}</Grid>
          </Grid>
        );
    }
  };

  return (
    <Container
      maxWidth='md'
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 8
      }}
    >
      <Paper
        elevation={1}
        sx={{
          borderRadius: 4,
          p: { xs: 2, sm: 4, md: 6 },
          margin: 'auto',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {renderLayout()}
      </Paper>
    </Container>
  );
};

const LogoContainer = () => {
  return (
    <Box
      sx={{
        width: { xs: 150, sm: 200 },
        height: { xs: 150, sm: 200 },
        maxWidth: '100%',
        borderRadius: 2,
        p: 1,
        backgroundColor: 'background.paper'
      }}
    >
      <picture>
        <source srcSet='/assets/images/logo.avif' type='image/avif' />
        <source srcSet='/assets/images/logo.webp' type='image/webp' />
        <img
          loading='lazy'
          src='/assets/images/logo.png'
          alt='Logo'
          className='w-72 h-auto object-contain'
        />
      </picture>
    </Box>
  );
};
