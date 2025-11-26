'use client';

import type { FC } from 'react';

import { useCallback, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockResetIcon from '@mui/icons-material/LockReset';
import SecurityIcon from '@mui/icons-material/Security';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useRouter, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import { apiFetcher } from '@/config/api-fetcher';
import { getErrorMessage } from '@/config/error.mapper';
import {
  resetPasswordSchema,
  ResetPasswordDto
} from '@/features/auth/auth.schema';
import { DataResponse } from '@/interfaces/data-response.interface';

interface ResetPasswordContainerProps {}

export const ResetPasswordContainer: FC<ResetPasswordContainerProps> = () => {
  const router = useRouter();
  const searchParams = useSearch({
    strict: true,
    from: '/auth/reset-password'
  });

  const token = searchParams.token;
  const email = searchParams.email;

  const { control, handleSubmit, setError, setValue } =
    useForm<ResetPasswordDto>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
        password: '',
        password_confirmation: ''
      }
    });

  const mutation = useMutation<
    DataResponse<boolean>,
    unknown,
    ResetPasswordDto
  >({
    mutationFn: async resetPasswordInput =>
      apiFetcher.post('/auth/reset-password', resetPasswordInput),
    onError: error => {
      const mappedError = getErrorMessage(error);

      setError('password', {
        type: 'manual',
        message: mappedError
      });
    }
  });

  const tokenQuery = useQuery({
    queryKey: ['validate-token', token, email],
    queryFn: () =>
      apiFetcher
        .get<DataResponse<boolean>>('/auth/validate-token', {
          params: { token, email }
        })
        .then(response => response.data),
    enabled: Boolean(token && email),
    refetchInterval: false
  });

  const onBackToLogin = useCallback(() => {
    router.navigate({ to: '/auth/login' });
  }, [router]);

  useEffect(() => {
    if (email) setValue('email', email);
    if (token) setValue('token', token);
  }, [email, token, setValue]);

  if (mutation.isSuccess)
    return <ResetPasswordSuccess onBackToLogin={onBackToLogin} />;

  if (!token || !email) return <InvalidResetLink />;

  if (tokenQuery.isPending) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          gap: 3
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant='h6' color='text.secondary'>
          Verificando seguridad...
        </Typography>
        <Typography variant='body2' textAlign='center' sx={{ maxWidth: 350 }}>
          Estamos validando tu enlace de recuperación para proteger tu cuenta
        </Typography>
      </Box>
    );
  }

  if (tokenQuery.isError || !tokenQuery.data?.data) return <InvalidResetLink />;

  return (
    <>
      <Box sx={{ textAlign: 'center', mb: 2.5 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'white',
            mb: 1.5
          }}
        >
          <LockResetIcon fontSize='medium' />
        </Box>

        <Typography
          variant='h6'
          component='h1'
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1,
            fontSize: '1.25rem'
          }}
        >
          Restablecer contraseña
        </Typography>

        <Typography
          variant='body2'
          sx={{
            color: 'text.secondary',
            maxWidth: 380,
            mx: 'auto',
            lineHeight: 1.5,
            fontSize: '0.875rem'
          }}
        >
          Ingresa tu nueva contraseña para completar el proceso de recuperación.
        </Typography>
      </Box>

      <Card
        variant='outlined'
        sx={{
          mb: 2.5,
          bgcolor: 'success.50',
          borderColor: 'success.200'
        }}
      >
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack direction='row' spacing={1.5} alignItems='center'>
            <CheckCircleIcon color='success' fontSize='small' />
            <Typography
              variant='body2'
              color='success.main'
              fontWeight={500}
              sx={{ fontSize: '0.8125rem' }}
            >
              Token válido - Puedes continuar
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {mutation.isError && (
        <Alert
          severity='error'
          variant='outlined'
          sx={{
            mb: 2.5,
            fontSize: '0.8125rem',
            py: 1
          }}
          icon={<SecurityIcon fontSize='small' />}
        >
          {getErrorMessage(mutation.error)}
        </Alert>
      )}

      <Box sx={{ width: '100%' }}>
        <form onSubmit={handleSubmit(data => mutation.mutate(data))}>
          <Stack spacing={2.5}>
            <CustomFormTextField
              fullWidth
              disabled
              id='email'
              control={control}
              name='email'
              fieldType='text'
              label='Correo Electrónico'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <EmailIcon color='action' />
                  </InputAdornment>
                )
              }}
            />

            <CustomFormTextField
              fullWidth
              id='password'
              control={control}
              name='password'
              fieldType='password'
              label='Nueva Contraseña'
              placeholder='Mínimo 8 caracteres'
            />

            <CustomFormTextField
              fullWidth
              id='password_confirmation'
              control={control}
              name='password_confirmation'
              fieldType='password'
              label='Confirmar Contraseña'
              placeholder='Repite tu nueva contraseña'
            />

            <LoadingButton
              fullWidth
              variant='contained'
              type='submit'
              loadingPosition='start'
              startIcon={<LockResetIcon />}
              color='primary'
              loading={mutation.isPending}
            >
              Cambiar contraseña
            </LoadingButton>
          </Stack>
        </form>
      </Box>

      <Card variant='outlined' sx={{ mt: 2.5, textAlign: 'left' }}>
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography
            variant='body2'
            fontWeight={600}
            sx={{ mb: 1, fontSize: '0.8125rem' }}
          >
            Consejos para una contraseña segura:
          </Typography>
          <Stack spacing={0.5}>
            {[
              'Usa al menos 8 caracteres',
              'Combina mayúsculas y minúsculas',
              'Incluye números y símbolos',
              'Evita información personal'
            ].map((tip, index) => (
              <Typography
                key={index}
                variant='body2'
                sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
              >
                • {tip}
              </Typography>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }}>
        <Chip label='o' size='small' sx={{ fontSize: '0.75rem' }} />
      </Divider>

      <Button
        fullWidth
        component={Link}
        to='/auth/login'
        variant='outlined'
        startIcon={<ArrowBackIcon />}
      >
        Volver a iniciar sesión
      </Button>
    </>
  );
};

interface ResetPasswordSuccessProps {
  onBackToLogin: () => void;
}

const ResetPasswordSuccess: FC<ResetPasswordSuccessProps> = ({
  onBackToLogin
}) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'success.main',
          color: 'white',
          mb: 1.5
        }}
      >
        <CheckCircleIcon fontSize='medium' />
      </Box>

      <Typography
        variant='h6'
        component='h1'
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 2,
          fontSize: '1.25rem'
        }}
      >
        ¡Contraseña actualizada!
      </Typography>

      <Alert
        severity='success'
        variant='filled'
        sx={{
          mb: 2.5,
          textAlign: 'left'
        }}
      >
        <Typography
          variant='body2'
          fontWeight={500}
          sx={{ fontSize: '0.8125rem' }}
        >
          Tu contraseña ha sido cambiada exitosamente
        </Typography>
      </Alert>

      <Card variant='outlined' sx={{ mb: 2.5, textAlign: 'left' }}>
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SecurityIcon color='success' fontSize='small' />
              <Typography variant='body2' sx={{ fontSize: '0.8125rem' }}>
                <strong>Cuenta segura:</strong> Tu nueva contraseña está activa
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LockResetIcon color='info' fontSize='small' />
              <Typography variant='body2' sx={{ fontSize: '0.8125rem' }}>
                <strong>Próximos pasos:</strong> Inicia sesión con tu nueva
                contraseña
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Typography
        variant='body2'
        sx={{
          mb: 2.5,
          color: 'text.secondary',
          fontSize: '0.8125rem'
        }}
      >
        Por seguridad, todos los tokens de recuperación han sido invalidados.
      </Typography>

      <Button
        fullWidth
        variant='contained'
        startIcon={<ArrowBackIcon />}
        onClick={onBackToLogin}
      >
        Iniciar sesión
      </Button>
    </Box>
  );
};

export const InvalidResetLink: FC = () => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'error.main',
          color: 'white',
          mb: 1.5
        }}
      >
        <SecurityIcon fontSize='medium' />
      </Box>

      <Typography
        variant='h6'
        component='h1'
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 2,
          fontSize: '1.25rem'
        }}
      >
        Enlace inválido
      </Typography>

      <Alert
        severity='error'
        variant='outlined'
        sx={{
          mb: 2.5
        }}
      >
        <Typography variant='body2' sx={{ fontSize: '0.8125rem' }}>
          Este enlace de recuperación no es válido o ha expirado,
        </Typography>
      </Alert>

      <Typography
        variant='body2'
        sx={{
          mb: 2.5,
          color: 'text.secondary',
          fontSize: '0.8125rem'
        }}
      >
        Solicita un nuevo enlace de recuperación desde la página de inicio de
        sesión.
      </Typography>

      <Stack spacing={1.5}>
        <Button
          fullWidth
          component={Link}
          to='/auth/forgot-password'
          variant='contained'
          startIcon={<LockResetIcon />}
        >
          Solicitar nuevo enlace
        </Button>

        <Button
          fullWidth
          component={Link}
          to='/auth/login'
          variant='outlined'
          startIcon={<ArrowBackIcon />}
        >
          Volver a iniciar sesión
        </Button>
      </Stack>
    </Box>
  );
};
