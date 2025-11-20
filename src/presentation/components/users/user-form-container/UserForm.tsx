import type { DataResponse } from '@/domain/interfaces/data-response.interface';
import type { Role } from '@/domain/interfaces/role.interface';
import type { User } from '@/domain/interfaces/user.interface';
import type { FC } from 'react';

import { useMemo, useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { MuiTelInput } from 'mui-tel-input';
import {
  Controller,
  DefaultValues,
  FormProvider,
  useForm
} from 'react-hook-form';
import { toast } from 'sonner';

import { ModeAction } from '@/config/enums/mode-action.enum';
import { Environment } from '@/config/environments/env';
import { CustomError } from '@/config/errors/custom.error';
import { ErrorMapper } from '@/config/mappers/error.mapper';
import { customFaker } from '@/config/utils/faker.util';
import { CustomOption } from '@/domain/interfaces/custom-option.interface';
import { UserService } from '@/infrastructure/services/user.service';
import { CustomFormTextField } from '@/presentation/components/shared/forms/CustomFormTextField';
import { UserDto, userSchema } from '@/presentation/schemas/user.schema';

type UserFormProps =
  | { mode: ModeAction.Create; roles: Role[] }
  | {
      mode: Exclude<ModeAction, ModeAction.Create>;
      user: User;
      roles: Role[];
    };

export const UserForm: FC<UserFormProps> = props => {
  const { mode, roles } = props;

  const user = 'user' in props ? props.user : null;

  const navigate = useNavigate();

  const defaultValues = useMemo<DefaultValues<UserDto>>(() => {
    const userValues: DefaultValues<UserDto> = {
      ...(user && { id: user?.id }),
      mode,
      name:
        user?.name ?? (Environment.isProd ? '' : customFaker.person.fullName()),
      username:
        user?.username ??
        (Environment.isProd
          ? ''
          : customFaker.internet
              .username()
              .replace(/[^\w.-]/g, '')
              .slice(0, 20)
              .toLowerCase()),
      email:
        user?.email ??
        (Environment.isProd ? '' : customFaker.internet.email().toLowerCase()),
      active: user?.active ?? true,
      role_id: user?.roles?.[0]?.id ?? undefined
    };

    return userValues;
  }, [mode, user]);

  const methods = useForm<UserDto>({
    mode: 'onBlur',
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues
  });

  const { control, handleSubmit, setError, watch } = methods;

  const roleId = watch('role_id');

  const mutation = useMutation<DataResponse<User>, Error, UserDto>({
    mutationFn: data => {
      if (data.mode === ModeAction.Create) return UserService.createUser(data);
      if (user && data.mode === ModeAction.Edit)
        return UserService.updateUser(user.id, data);
      throw new CustomError(`Invalid mode: ${data.mode}`);
    },
    onSuccess: async ({}) => {
      // invalidateModules(['users'], queryClient);
      navigate({ to: '/users' });
    }
  });

  const isDisabled = useMemo(
    () => mode === ModeAction.Show || mutation.isPending,
    [mode, mutation.isPending]
  );

  const onSaveUser = useCallback(
    async (data: UserDto) => {
      const toastId = toast.loading('Saving user...');

      try {
        const { message } = await mutation.mutateAsync(data);

        toast.success(message, { id: toastId });
      } catch (error) {
        const mappedError = ErrorMapper.mapErrorToApiResponse(error);

        toast.error(mappedError.message, { id: toastId });
        for (const field in mappedError.errors) {
          const message = mappedError.errors[field];

          setError(field as keyof UserDto, { message: message[0] });
        }
      }
    },
    [mutation, setError]
  );

  const roleOptions = useMemo<CustomOption[]>(
    () => roles.map(role => ({ value: role.id, label: role.description })),
    [roles]
  );

  const currentRole = useMemo<Role | null>(
    () => roles.find(role => role.id === roleId) ?? null,
    [roleId, roles]
  );

  return (
    <FormProvider {...methods}>
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
                  fieldType='select'
                  name='role_id'
                  label={'Role'}
                  placeholder='Select role'
                  control={control}
                  disabled={isDisabled}
                  options={roleOptions}
                />
              </Grid>
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
    </FormProvider>
  );
};
