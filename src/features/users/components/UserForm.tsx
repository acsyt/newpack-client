import type { User } from '@/features/users/user.interface';
import type { FC } from 'react';

import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useNavigate } from '@tanstack/react-router';
import { DefaultValues, useForm } from 'react-hook-form';

import { useUsersMutation } from '../hooks/users.mutation';

import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { UserDto, userSchema } from '@/features/users/user.schema';

type UserFormProps = {
  mode: ModeAction;
  user?: User;
};

export const UserForm: FC<UserFormProps> = ({ mode, user }) => {
  const navigate = useNavigate();
  const mutation = useUsersMutation();

  const defaultValues = useMemo<DefaultValues<UserDto>>(() => {
    const userValues: DefaultValues<UserDto> = {
      mode,
      name: user?.name ?? '',
      last_name: user?.lastName ?? '',
      email: user?.email ?? '',
      active: user?.active ?? true
      //role_id: user?.roles?.[0]?.id ?? undefined
    };

    return userValues;
  }, [mode, user]);

  const { control, handleSubmit } = useForm<UserDto>({
    mode: 'onBlur',
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues
  });

  const isDisabled = useMemo(
    () => mode === ModeAction.Show || mutation.isPending,
    [mode, mutation.isPending]
  );

  const onSaveUser = (data: UserDto) => {
    const userId = user ? user.id : null;

    mutation.mutateAsync({ data, id: userId });
  };

  const onError = (errors: any) => {};

  return (
    <form onSubmit={handleSubmit(onSaveUser, onError)}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType='text'
                name='name'
                label='Nombre'
                placeholder='Ingrese un nombre'
                control={control}
                disabled={isDisabled}
                inputProps={{
                  maxLength: 50,
                  onInput: (e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value
                      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-.]/g, '')
                      .replace(/\s{2,}/g, ' ')
                      .slice(0, 50);
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType='text'
                name='last_name'
                label='Apellido'
                placeholder='Ingrese un apellido'
                control={control}
                disabled={isDisabled}
                inputProps={{
                  maxLength: 50,
                  onInput: (e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value
                      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-.]/g, '')
                      .replace(/\s{2,}/g, ' ')
                      .slice(0, 50);
                  }
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType='text'
                type='email'
                name='email'
                label='Email'
                placeholder='Ingrese su correo electrónico'
                control={control}
                disabled={isDisabled}
                inputProps={{
                  onInput: e => {
                    const value = e.currentTarget.value.replace(/\s/g, '');

                    if (!value.includes('@')) return;
                    e.currentTarget.value = value.slice(0, 100);
                  }
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType='switch'
                control={control}
                name='active'
                label='Estado'
                disabled={isDisabled}
                labelFalse='Inactivo'
                labelTrue='Activo'
              />
            </Grid>
          </Grid>
        </Grid>

        {!isDisabled && (
          <Grid
            size={12}
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '5px'
            }}
          >
            <Button
              variant='outlined'
              color='cancel'
              onClick={() => navigate({ to: '/users' })}
            >
              Cancelar
            </Button>
            <Button
              color='primary'
              type='submit'
              disabled={mutation.isPending || isDisabled}
              variant={mutation.isPending ? 'outlined' : 'contained'}
            >
              {mutation.isPending ? 'Guardando usuario...' : 'Guardar usuario'}
            </Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
};
