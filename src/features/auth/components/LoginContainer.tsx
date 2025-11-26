import type { FC } from 'react';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MUILink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link } from '@tanstack/react-router';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { useLogin } from '../hooks/mutations';

import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import { Environment } from '@/config/env';
import { getErrorMessage } from '@/config/error.mapper';
import { loginSchema, LoginDto } from '@/features/auth/auth.schema';

interface LoginContainerProps {}

export const LoginContainer: FC<LoginContainerProps> = ({}) => {
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(show => !show);

  const { control, handleSubmit, setError } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: !Environment.isProd ? 'admin@acsyt.com' : '',
      password: !Environment.isProd ? '123456' : ''
    }
  });

  const onLogin = async (loginValues: LoginDto) => {
    try {
      await loginMutation.mutateAsync(loginValues);
    } catch (error) {
      const message = getErrorMessage(error);

      setError('email', {
        type: 'manual',
        message: message
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onLogin)}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <CustomFormTextField
            fullWidth
            fieldType='text'
            id='email'
            control={control}
            name='email'
            label='Email'
            placeholder='Ingrese su correo electrónico'
            disabled={loginMutation.isPending}
          />
        </Grid>

        <Grid size={12}>
          <CustomFormTextField
            fullWidth
            fieldType='password'
            control={control}
            name='password'
            label='Contraseña'
            placeholder='Ingrese su contraseña'
            type={showPassword ? 'text' : 'password'}
            id='password'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Lock size={18} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={togglePassword}
                  >
                    {showPassword ? (
                      <EyeOff size={18} aria-hidden='true' />
                    ) : (
                      <Eye size={18} aria-hidden='true' />
                    )}
                  </IconButton>
                </InputAdornment>
              )
            }}
            disabled={loginMutation.isPending}
          />
        </Grid>

        <Grid size={12}>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <FormControlLabel
              control={<Checkbox name='remember' color='primary' />}
              label='Recordarme'
            />
            <MUILink
              to='/auth/forgot-password'
              component={Link}
              underline='hover'
            >
              <Typography color='primary' variant='body2'>
                Olvidé mi contraseña
              </Typography>
            </MUILink>
          </Box>
        </Grid>

        <Grid size={12}>
          <Button
            fullWidth
            color='primary'
            variant={loginMutation.isPending ? 'outlined' : 'contained'}
            type='submit'
            sx={{ height: '40px' }}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
