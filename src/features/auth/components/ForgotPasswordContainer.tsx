import type { FC } from 'react';

import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle, Clock, Mail, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import { getErrorMessage } from '@/config/error.mapper';
import {
  ForgotPasswordDto,
  forgotPasswordSchema
} from '@/features/auth/auth.schema';
import { AuthService } from '@/features/auth/auth.service';

interface ForgotPasswordContainerProps {}

export const ForgotPasswordContainer: FC<ForgotPasswordContainerProps> = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });
  const email = watch('email');

  const forgotPasswordMutation = useMutation({
    mutationFn: AuthService.forgotPassword,
    onSuccess: () => {},
    onError: error => {
      const newError = getErrorMessage(error);

      setError('email', {
        type: 'manual',
        message: newError
      });
    }
  });

  const onTryAgain = useCallback(() => {
    forgotPasswordMutation.reset();
  }, [forgotPasswordMutation]);

  const onForgotPassword = async (forgotPasswordValues: ForgotPasswordDto) => {
    try {
      await forgotPasswordMutation.mutateAsync(forgotPasswordValues);
    } catch (error) {
      const newError = getErrorMessage(error);

      setError('email', {
        type: 'manual',
        message: newError
      });
    }
  };

  if (forgotPasswordMutation.isSuccess) {
    return <ForgotPasswordInstructions email={email} onTryAgain={onTryAgain} />;
  }

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
            color: '#fff',
            mb: 1.5
          }}
        >
          <Shield size={20} />
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
          Olvidé mi contraseña
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
          Ingrese su correo electrónico y le enviaremos un enlace para
          restablecer su contraseña.
        </Typography>
      </Box>

      <Card
        variant='outlined'
        sx={{
          mb: 2.5,
          bgcolor: 'primary.50',
          borderColor: 'primary.200'
        }}
      >
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack direction='row' spacing={1.5} alignItems='center'>
            <Shield
              size={16}
              color='currentColor'
              style={{ color: 'inherit' }}
            />
            <Typography
              variant='body2'
              color='primary.main'
              fontWeight={500}
              sx={{ fontSize: '0.8125rem' }}
            >
              Ingrese su correo electrónico y le enviaremos un enlace para
              restablecer su contraseña.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {forgotPasswordMutation.isError && (
        <Alert
          severity='error'
          variant='outlined'
          sx={{
            mb: 2.5,
            fontSize: '0.8125rem',
            py: 1
          }}
          icon={<Shield size={16} />}
        >
          {getErrorMessage(forgotPasswordMutation.error)}
        </Alert>
      )}

      <Box sx={{ width: '100%' }}>
        <form onSubmit={handleSubmit(onForgotPassword)}>
          <Stack spacing={2.5}>
            <CustomFormTextField
              fullWidth
              fieldType='text'
              id='email'
              control={control}
              name='email'
              error={Boolean(errors.email?.message)}
              label='Email'
              placeholder='Ingrese su correo electrónico'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Mail
                      size={18}
                      color='currentColor'
                      style={{ opacity: 0.54 }}
                    />
                  </InputAdornment>
                )
              }}
              disabled={forgotPasswordMutation.isPending}
            />

            <LoadingButton
              fullWidth
              variant='contained'
              type='submit'
              loadingPosition='start'
              startIcon={<Mail size={18} />}
              color='primary'
              loading={forgotPasswordMutation.isPending}
            >
              Send email
            </LoadingButton>
          </Stack>
        </form>
      </Box>

      <Divider sx={{ my: 2 }}>
        <Chip label='Or' size='small' sx={{ fontSize: '0.75rem' }} />
      </Divider>

      <Button
        fullWidth
        component={Link}
        to='/auth/login'
        variant='outlined'
        startIcon={<ArrowLeft size={18} />}
      >
        Back to login
      </Button>
    </>
  );
};

interface ForgotPasswordInstructionsProps {
  email: string;
  onTryAgain: () => void;
}

const ForgotPasswordInstructions: FC<ForgotPasswordInstructionsProps> = ({
  email,
  onTryAgain
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
          color: 'success.contrastText',
          mb: 1.5
        }}
      >
        <CheckCircle size={20} />
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
        Check your email
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
          We've sent a password reset link to {email}. Click the link in the
          email to reset your password.
        </Typography>
      </Alert>

      <Card variant='outlined' sx={{ mb: 2.5, textAlign: 'left' }}>
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Clock
                size={16}
                color='currentColor'
                style={{ color: 'inherit' }}
              />
              <Typography variant='body2' sx={{ fontSize: '0.8125rem' }}>
                <strong>Expiration time</strong> 60 minutes
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Mail
                size={16}
                color='currentColor'
                style={{ color: 'inherit' }}
              />
              <Typography variant='body2' sx={{ fontSize: '0.8125rem' }}>
                <strong>Can't see email?</strong> If you don't see the email,
                check your spam folder.
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
        If you don't receive the email in the next 10 minutes, you can{' '}
        <Box
          component='button'
          sx={{
            background: 'none',
            border: 'none',
            color: 'primary.main',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.8125rem',
            fontFamily: 'inherit',
            '&:hover': {
              textDecoration: 'none'
            }
          }}
          onClick={onTryAgain}
        >
          Try again
        </Box>
      </Typography>

      <Stack spacing={1.5}>
        <Button
          fullWidth
          component={Link}
          to='/auth/login'
          variant='contained'
          startIcon={<ArrowLeft size={18} />}
        >
          Back to login
        </Button>

        <Button
          fullWidth
          variant='outlined'
          startIcon={<Mail size={18} />}
          onClick={onTryAgain}
        >
          Resend email
        </Button>
      </Stack>
    </Box>
  );
};
