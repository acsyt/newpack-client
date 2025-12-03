import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';


import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'
import { useNavigate } from '@tanstack/react-router';
import { Controller, DefaultValues, FieldErrors, useForm } from 'react-hook-form';

import { useUsersMutation } from '../hooks/users.mutation';

import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { UserDto, userSchema } from '@/features/users/user.schema';
import type { User } from '@/features/users/user.interface';
import { CustomOption } from '@/interfaces/custom-option.interface';
import { useRolesQuery } from '@/features/role/hook/role.query';
import { useUsersQuery } from '../hooks/users.query';
import { StaticAutocomplete } from '@/components/shared/StaticAutocomplete';

type UserFormProps = {
  mode: ModeAction;
  user?: User;
};

export const UserForm: FC<UserFormProps> = ({ mode, user }) => {
  const navigate = useNavigate();
  const mutation = useUsersMutation();
  const isShow = mode === ModeAction.Show;

  const [rolesOptions, setRolesOptions] = useState<CustomOption[]>([{ 
    key: 1,  
    value: 1, 
    label: user?.roles[0] ?? ''
  }]);

  const [usersOptions, setUsersOptions] = useState<CustomOption[]>([{
    key: 1,  
    value: 1, 
    label: user?.name ?? '' //TODO: ver de donde se va a sacar esta propiedad para que se mantenga estatica
  }]);

  const {
    data: roles, 
  } = useRolesQuery({
    enabled: (mode === ModeAction.Show) ? false : true,
    options: {has_pagination: false},
    staleTime: 5 * 60 * 1000,
    retry: false 
  });

  const {
    data: users
  } = useUsersQuery({
    enabled: (mode === ModeAction.Show) ? false : true, 
    options: {has_pagination: false},
    staleTime: 5 * 60 * 1000,
    retry: false
  });
    
  const defaultValues = useMemo<DefaultValues<UserDto>>(() => {
    const userValues: DefaultValues<UserDto> = {
      mode,
      name: user?.name ?? '',
      last_name: user?.lastName ?? '',
      email: user?.email ?? '',
      active: user?.active ?? true,
      phone: user?.phone ?? '',
      role_id: 1,
      password: '',
      password_confirmation: '',
      immediate_supervisor_id: 0
    };
    return userValues;
  }, [mode, user]);

  const { control, handleSubmit,setValue } = useForm<UserDto>({
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

  const onError = (_errors: FieldErrors<UserDto>) => {};
  
  useEffect(()=>{
      if(!roles?.data) return;
      const options = roles.data.map(item => {
        return {
          key: item.id, 
          value: item.id,
          label: item.name
        }
      });
      const roleId = options.find(entry => entry.label === user?.roles[0])?.value
      setValue('role_id', roleId ?? 0);
      setRolesOptions(options);
  }, [roles]);

  useEffect(()=>{
     if(!users?.data) return;
     const options = users.data.map((item) => {
        return {
          key: item.id,
          value: item.id,
          label: item.name
        }
     });
     setUsersOptions(options);
  }, [users]);  

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
            <Grid size={{ xs: 12, md: 6 }}>
             <Controller
                name="phone"
                control={control}
                disabled={isDisabled}
                render={({ field, fieldState }) => (
                  <MuiTelInput
                    {...field}
                    value={field.value || ''} 
                    onChange={(value) => field.onChange(value)}
                    defaultCountry="MX"
                    forceCallingCode
                    focusOnSelectCountry
                    label="Teléfono"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            
          </Grid>
        </Grid>

        {/* Informacion de tipos de user */}
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType='select'
                control={control}
                name='role_id'
                label='Rol'
                disabled={isDisabled}
                options={rolesOptions}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="immediate_supervisor_id"
                  control={control}
                  render={({ field: { onChange, value} }) => {
                    const conditionalValue = (isShow) ? 1 : value;
                    const selectedOption = usersOptions.find(opt => opt.value === conditionalValue) ?? null;
                    return (
                      <StaticAutocomplete
                        label="Jefe inmediato"
                        options={usersOptions}
                        value={selectedOption}
                        disabled={isShow}
                        onChange={(newValue: CustomOption | null) =>
                          onChange(newValue ? newValue.value : undefined)
                        }
                      />
                    );
                  }}
                />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType='password'
                name='password'
                label='Password'
                control={control}
                disabled={isDisabled}               
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType='password'
                name='password_confirmation'
                label='Confirme password'
                control={control}
                disabled={isDisabled}               
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
