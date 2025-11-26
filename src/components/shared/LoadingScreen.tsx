import type { FC } from 'react';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

import logo from '/assets/images/logo.png';

interface LoadingScreenProps {
  message?: string;
  isLoading?: boolean;
  timeout?: number;
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
    | 'inherit';
  size?: number;
  overlay?: boolean;
}

export const LoadingScreen: FC<LoadingScreenProps> = ({
  message,
  isLoading = true,
  timeout = 500,
  size = 120,
  overlay = true
}) => {
  if (!isLoading) return null;

  return (
    <Fade in={isLoading} timeout={timeout}>
      <Box
        sx={{
          position: overlay ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: theme => theme.zIndex.modal + 1,
          backgroundColor: overlay ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 1
            },
            '50%': {
              transform: 'scale(1.05)',
              opacity: 0.7
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1
            }
          }
        }}
      >
        <Box
          component='img'
          src={logo}
          alt='Loading...'
          sx={{
            width: size,
            height: size,
            objectFit: 'contain',
            animation: 'pulse 1.5s infinite ease-in-out'
          }}
        />
        {message && (
          <Typography
            variant='body1'
            color='textSecondary'
            sx={{ mt: 2, fontWeight: 500 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};
