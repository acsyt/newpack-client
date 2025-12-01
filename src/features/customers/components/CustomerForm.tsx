import type { FC } from 'react';
import { useMemo} from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useNavigate } from '@tanstack/react-router';
import { DefaultValues, useForm } from 'react-hook-form';

import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { Customer } from '@/features/customers/customer.interface';
import { CustomerDto, customerSchema } from '@/features/customers/customer.schema';
import { useCustomersMutation } from '@/features/customers/hook/customer.mutation';
import { CustomOption } from '@/interfaces/custom-option.interface';
import { FormAddress } from '@/features/shared/components/FormAddress';

type CustomerFormProps = {
  mode: ModeAction;
  customer?: Customer;
};

export const CustomerForm: FC<CustomerFormProps> = ({ mode,  customer}) => {
  const navigate = useNavigate();
  const mutation = useCustomersMutation();
  
  const defaultValues = useMemo<DefaultValues<CustomerDto>>(() => {
    const userValues: DefaultValues<CustomerDto> = {
        mode: mode,
        name: customer?.name || '',
        last_name: customer?.lastName || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        phone_secondary: customer?.phoneSecondary || '',
        suburb_id: customer?.suburbId || 0,
        street: customer?.street || '',
        exterior_number: customer?.exteriorNumber || '',
        interior_number: customer?.interiorNumber || '',
        address_reference: customer?.addressReference || '',
        rfc: customer?.rfc || '',
        legal_name: customer?.legalName || '',
        status: customer?.status || 'active',
        notes: customer?.notes || '',
        zip_code: customer?.suburb?.zipCode?.name ?? '',
        city: customer?.suburb?.zipCode?.city?.name ?? '',
        state: customer?.suburb.zipCode?.city?.state?.name ?? ''
    };
    return userValues;
  }, [customer, mode]);

  const { control, handleSubmit, watch, setValue} = useForm<CustomerDto>({
    mode: 'onBlur',
    resolver: zodResolver(customerSchema),
    defaultValues: defaultValues
  });

  const isDisabled = useMemo(
    () => mode === ModeAction.Show || mutation.isPending,
    [mode, mutation.isPending]
  );

  const onSaveUser = (data: CustomerDto) => {
    mutation.mutateAsync({ 
        id: customer ? customer.id : null, 
        data: data
    });
  };
  
  const supplierStatusOptions: CustomOption[] = [
    {
      key: 'active',
      value: 'active',
      label: 'Activo',
      disabled: false
    },
    {
      key: 'inactive',
      value: 'inactive',
      label: 'Inactivo',
      disabled: false
    },
    {
      key: 'suspended',
      value: 'suspended',
      label: 'Suspendido',
      disabled: false
    },
    {
      key: 'blacklisted',
      value: 'blacklisted',
      label: 'En lista negra',
      disabled: false
    },
  ];

  const onError = (errors: any) => {};

  return (
    <form onSubmit={handleSubmit(onSaveUser, onError)}>
      <Grid container spacing={3}>
        {/* Datos personales */}
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
              />
            </Grid>            
          </Grid>
        </Grid>

        {/* Contacto */}
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType='text'
                name='email'
                label='Correo electrónico'
                placeholder='Ingrese un correo electrónico'
                control={control}
                disabled={isDisabled}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <CustomFormTextField
                fieldType='text'
                name='phone'
                label='Teléfono'
                placeholder='Ingrese el teléfono'
                control={control}
                disabled={isDisabled}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <CustomFormTextField
                fieldType='text'
                name='phone_secondary'
                label='Teléfono secundario'
                placeholder='Ingrese otro teléfono'
                control={control}
                disabled={isDisabled}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Dirección */}
        <FormAddress 
          control={control}
          isDisabled={isDisabled}
          labels={{
            city: 'city',
            state: 'state',
            suburb_id: 'suburb_id',
            zip_code: 'zip_code'
          }}
          setValue={setValue}
          watch={watch}
        />

        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType='text'
                name='street'
                label='Calle'
                placeholder='Ingrese la calle'
                control={control}
                disabled={isDisabled}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <CustomFormTextField
                fieldType='text'
                name='exterior_number'
                label='Número exterior'
                placeholder='Ingrese el número exterior'
                control={control}
                disabled={isDisabled}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <CustomFormTextField
                fieldType='text'
                name='interior_number'
                label='Número interior'
                placeholder='Ingrese el número interior'
                control={control}
                disabled={isDisabled}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <CustomFormTextField
                fieldType='text'
                name='address_reference'
                label='Referencia de dirección'
                placeholder='Ingrese una referencia'
                control={control}
                disabled={isDisabled}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Fiscales */}
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType='text'
                name='rfc'
                label='RFC'
                placeholder='Ingrese el RFC'
                control={control}
                disabled={isDisabled}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType='text'
                name='legal_name'
                label='Razón social'
                placeholder='Ingrese la razón social'
                control={control}
                disabled={isDisabled}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Notas */}
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomFormTextField
                fieldType="select"
                name="status"
                label="Estatus"
                placeholder="Estatus"
                control={control}
                disabled={isDisabled}
                options={supplierStatusOptions}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
                <CustomFormTextField
                  fieldType='text'
                  name='notes'
                  label='Notas'
                  placeholder='Ingrese notas adicionales'
                  control={control}
                  disabled={isDisabled}
                  multiline
                  rows={3}
                />
            </Grid>
          </Grid>
        </Grid>

        {/* Botones */}
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
              onClick={() => navigate({ to: '/customers' })}
            >
              Cancelar
            </Button>
            <Button
              color='primary'
              type='submit'
              disabled={mutation.isPending || isDisabled}
              variant={mutation.isPending ? 'outlined' : 'contained'}
            >
              {mutation.isPending ? 'Guardando cliente...' : 'Guardar cliente'}
            </Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
};
