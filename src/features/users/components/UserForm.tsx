import type { User } from '@/features/users/user.interface';
import type { FC } from 'react';

import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useNavigate } from '@tanstack/react-router';
import { MuiTelInput } from 'mui-tel-input';
import { Controller, DefaultValues, useForm } from 'react-hook-form';

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
      username: user?.username ?? '',
      email: user?.email ?? '',
      active: user?.active ?? true,
      role_id: user?.roles?.[0]?.id ?? undefined
    };

    return userValues;
  }, [mode, user]);

  const { control, handleSubmit, setError, watch } = useForm<UserDto>({
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

  return (
    <form onSubmit={handleSubmit(onSaveUser)}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType='text'
                name='name'
                label='Full Name'
                placeholder='Enter full name'
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
                name='username'
                label='Username'
                placeholder='Enter username'
                control={control}
                disabled={isDisabled}
                inputProps={{
                  maxLength: 20,
                  onInput: (e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value
                      .toLowerCase()
                      .replace(/[^\w.-]/g, '')
                      .slice(0, 20);
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
                placeholder='Enter email'
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='phone'
                control={control}
                render={({
                  field: { ref: fieldRef, value, ...fieldProps },
                  fieldState: { error }
                }) => (
                  <MuiTelInput
                    {...fieldProps}
                    fullWidth
                    disableDropdown
                    label={'Phone'}
                    placeholder='Enter phone number'
                    value={value ?? ''}
                    inputRef={fieldRef}
                    preferredCountries={['US']}
                    defaultCountry='US'
                    onlyCountries={['US']}
                    helperText={error?.message}
                    disabled={isDisabled}
                    error={Boolean(error)}
                    slotProps={{
                      input: {
                        inputProps: {
                          maxLength: 16
                        }
                      }
                    }}
                    onChange={newValue => {
                      const digits = newValue.replace(/\D/g, '');

                      if (digits === '' || digits === '1') {
                        fieldProps.onChange(undefined);

                        return;
                      }

                      if (!newValue.startsWith('+1')) {
                        fieldProps.onChange(
                          '+1' + newValue.replace(/^\+?1?/, '')
                        );
                      } else {
                        fieldProps.onChange(newValue);
                      }
                    }}
                  />
                )}
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
                label={'Status'}
                disabled={isDisabled}
                labelFalse={'Inactive'}
                labelTrue={'Active'}
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
              Cancel
            </Button>
            <Button
              color='primary'
              type='submit'
              disabled={mutation.isPending || isDisabled}
              variant={mutation.isPending ? 'outlined' : 'contained'}
            >
              {mutation.isPending ? 'Saving user...' : 'Save user'}
            </Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
};
