import type { FC } from 'react';

import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useNavigate } from '@tanstack/react-router';
import { DefaultValues, FieldErrors, useForm } from 'react-hook-form';

import { useSupplierMutation } from '@/features/suppliers/hooks/supplier.mutation';

import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { SupplierDto, supplierSchema } from '@/features/suppliers/supplier.schema';
import type { Supplier } from '@/features/suppliers/supplier.interface';
import { CustomOption } from '@/interfaces/custom-option.interface';
import { FormAddress } from '@/features/shared/components/FormAddress';

type SupplierFormProps = {
  mode: ModeAction;
  supplier?: Supplier ;
};

export const SupplierForm: FC<SupplierFormProps> = ({ mode, supplier }) => {
  const navigate = useNavigate();
  const mutation = useSupplierMutation();

  const defaultValues = useMemo<DefaultValues<SupplierDto>>(() => {
    const userValues: DefaultValues<SupplierDto> = {
        mode,
        company_name: supplier?.companyName ?? '',
        contact_name: supplier?.contactName ?? '',
        email: supplier?.email ?? '',
        phone: supplier?.phone ?? '',
        phone_secondary: supplier?.phoneSecondary ?? '',
        suburb_id: supplier?.suburbId ?? 0,
        street: supplier?.street ?? '',
        exterior_number: supplier?.exteriorNumber ?? '',
        interior_number: supplier?.interiorNumber ?? '',
        address_reference: supplier?.addressReference ?? '',
        rfc: supplier?.rfc ?? '',
        legal_name: supplier?.legalName ?? '',
        tax_system: supplier?.taxSystem ?? '',
        status: supplier?.status ?? 'active',
        notes: supplier?.notes ?? '',
        zip_code: supplier?.suburb?.zipCode?.name ?? '',
        city: supplier?.suburb?.zipCode?.city?.name ?? '',
        state: supplier?.suburb.zipCode?.city?.state?.name ?? ''
    };

    return userValues;
  }, [mode, supplier]);

  const { control, handleSubmit, watch, setValue } = useForm<SupplierDto>({
    mode: 'onBlur',
    resolver: zodResolver(supplierSchema),
    defaultValues: defaultValues
  });

  const isDisabled = useMemo(
    () => mode === ModeAction.Show || mutation.isPending,
    [mode, mutation.isPending]
  );

  const onSaveSupplier = (data: SupplierDto) => {    
    const supplierId = supplier ? supplier.id : null;
    mutation.mutateAsync({ data, id: supplierId });
  };

  const onError = (_errors: FieldErrors<SupplierDto>) => {};

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

  return (
    <form onSubmit={handleSubmit(onSaveSupplier, onError)}>
      <Grid container spacing={3}>
        {/* Empresa y Contacto */}
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType="text"
                name="company_name"
                label="Nombre de la empresa"
                placeholder="Ingrese el nombre de la empresa"
                control={control}
                disabled={isDisabled}
                inputProps={{
                  maxLength: 100,
                  onInput: (e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value
                      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s&.,'-]/g, '')
                      .replace(/\s{2,}/g, ' ')
                      .slice(0, 100);
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType="text"
                name="contact_name"
                label="Nombre del contacto"
                placeholder="Ingrese el nombre del contacto"
                control={control}
                disabled={isDisabled}
                inputProps={{
                  maxLength: 50,
                  onInput: (e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value
                      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-.]/g, '')
                      .replace(/\s{2,}/g, ' ')
                      .slice(0, 50);
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Contacto */}
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomFormTextField
                fieldType="text"
                type="email"
                name="email"
                label="Correo electrónico"
                placeholder="Ingrese el correo electrónico"
                control={control}
                disabled={isDisabled}
                inputProps={{
                  onInput: (e) => {
                    const value = e.currentTarget.value.replace(/\s/g, '');
                    e.currentTarget.value = value.slice(0, 100);
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <CustomFormTextField
                fieldType="text"
                name="phone"
                label="Teléfono"
                placeholder="Ingrese el teléfono"
                control={control}
                disabled={isDisabled}
                inputProps={{
                  maxLength: 10,
                  onInput: (e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <CustomFormTextField
                fieldType="text"
                name="phone_secondary"
                label="Teléfono secundario"
                placeholder="Ingrese el teléfono secundario"
                control={control}
                disabled={isDisabled}
                inputProps={{
                  maxLength: 10,
                  onInput: (e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
                  },
                }}
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
          zipCode={supplier?.suburb?.zipCode?.name}
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

        {/* Datos Fiscales */}
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomFormTextField
                fieldType="text"
                name="rfc"
                label="RFC"
                placeholder="Ingrese el RFC"
                control={control}
                disabled={isDisabled}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <CustomFormTextField
                fieldType="text"
                name="legal_name"
                label="Razón social"
                placeholder="Ingrese la razón social"
                control={control}
                disabled={isDisabled}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <CustomFormTextField
                fieldType="text"
                name="tax_system"
                label="Régimen fiscal"
                placeholder="Ingrese el régimen fiscal"
                control={control}
                disabled={isDisabled}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Estado y Notas */}
        <Grid size={12}>
            <Grid container spacing={2} alignItems="flex-start">
                <Grid size={{ xs: 12, md: 3 }}>
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

                <Grid size={{ xs: 12, md: 9 }}>
                <CustomFormTextField
                    fieldType="text"
                    name="notes"
                    label="Notas"
                    placeholder="Notas adicionales sobre el proveedor"
                    control={control}
                    disabled={isDisabled}
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 200 }}
                />
                </Grid>
            </Grid>
          </Grid>


        {/* Botones */}
        {!isDisabled && (
          <Grid
            size={12}
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1.5,
            }}
          >
            <Button
              variant="outlined"
              color="cancel"
              onClick={() => navigate({ to: '/suppliers' })}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={mutation.isPending || isDisabled}
              variant={mutation.isPending ? 'outlined' : 'contained'}
            >
              {mutation.isPending ? 'Guardando proveedor...' : 'Guardar proveedor'}
            </Button>
          </Grid>
        )}
      </Grid>
    </form>

  );
};
