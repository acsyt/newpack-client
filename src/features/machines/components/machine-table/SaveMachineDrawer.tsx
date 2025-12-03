import { useMemo, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Autocomplete, Button, Grid } from '@mui/material';
import { DefaultValues, useForm, Controller } from 'react-hook-form';

import { useMachineDrawerStore } from '@/app/_authenticated/machines';
import { CustomDrawer } from '@/components/shared/CustomDrawer';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { Environment } from '@/config/env';
import { ErrorMapper } from '@/config/error.mapper';
import { FormHelper } from '@/config/helpers/form.helper';
import { customFaker } from '@/config/utils/faker.util';
import { useSaveDrawerMutation } from '@/features/machines/hooks/machines.query';
import { MachineParams } from '@/features/machines/machine.interface';
import { MachineDto, machineSchema } from '@/features/machines/machine.schema';
import { useProcessesQuery } from '@/features/processes';

interface SaveMachineDrawerProps {
  machineParams: MachineParams;
}

export const SaveMachineDrawer = ({
  machineParams
}: SaveMachineDrawerProps) => {
  const { isOpen, onClose, item, mode } = useMachineDrawerStore();

  const isProd = Environment.isProd;
  const isShow = mode === ModeAction.Show;

  const mutation = useSaveDrawerMutation({
    mode,
    id: item?.id || undefined,
    machineParams
  });

  const { data: processesData } = useProcessesQuery({
    options: { has_pagination: false }
  });
  const processes = useMemo(() => processesData?.data || [], [processesData]);

  const defaultValues = useMemo<DefaultValues<MachineDto>>(() => {
    if (item && mode !== ModeAction.Create) {
      return {
        mode,
        id: +item.id,
        code: item.code,
        name: item.name,
        process_id: +item.processId,
        speed_mh: item.speedMh ? +item.speedMh : null,
        speed_kgh: item.speedKgh ? +item.speedKgh : null,
        circumference_total: item.circumferenceTotal
          ? +item.circumferenceTotal
          : null,
        max_width: item.maxWidth ? +item.maxWidth : null,
        max_center: item.maxCenter ? +item.maxCenter : null
      };
    }

    if (isProd) {
      return {
        mode: ModeAction.Create,
        code: '',
        name: '',
        speed_mh: null,
        speed_kgh: null,
        circumference_total: null,
        max_width: null,
        max_center: null
      };
    }

    return {
      mode: ModeAction.Create,
      code: customFaker.string.alphanumeric(5).toUpperCase(),
      name: customFaker.commerce.productName(),
      speed_mh: customFaker.number.int({ min: 10, max: 100 }),
      speed_kgh: customFaker.number.int({ min: 10, max: 100 }),
      circumference_total: customFaker.number.int({ min: 100, max: 500 }),
      max_width: customFaker.number.int({ min: 50, max: 200 }),
      max_center: customFaker.number.int({ min: 20, max: 100 }),
      process_id:
        processes.length > 0
          ? customFaker.number.int({ min: 1, max: processes.length })
          : undefined
    };
  }, [item, mode, isProd, processes]);

  const form = useForm<MachineDto>({
    resolver: zodResolver(machineSchema),
    defaultValues
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const title = {
    [ModeAction.Create]: 'Crear Máquina',
    [ModeAction.Edit]: 'Editar Máquina',
    [ModeAction.Show]: 'Detalle Máquina'
  }[mode];

  return (
    <CustomDrawer
      open={isOpen}
      title={title}
      footer={
        ![ModeAction.Show].includes(mode) && (
          <Button
            fullWidth
            type='submit'
            variant='contained'
            color='primary'
            size='large'
            disabled={mutation.isPending}
            onClick={form.handleSubmit(data => {
              mutation.mutate(data, {
                onSuccess: () => {
                  onClose();
                },
                onError: error => {
                  const errors = ErrorMapper.mapErrorToApiResponse(error);

                  FormHelper.setFormErrors(errors.errors, form.setError);
                }
              });
            })}
          >
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        )
      }
      onClose={onClose}
    >
      <form className='flex flex-col h-full'>
        <Grid container spacing={2.5}>
          <Grid size={12}>
            <Controller
              control={form.control}
              name='code'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Código'
                  error={!!error}
                  helperText={error?.message}
                  disabled={isShow}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={form.control}
              name='name'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Nombre'
                  error={!!error}
                  helperText={error?.message}
                  disabled={isShow}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={form.control}
              name='process_id'
              render={({
                field: { onChange, value },
                fieldState: { error }
              }) => (
                <Autocomplete
                  options={processes}
                  getOptionLabel={option => option.name}
                  value={processes.find(p => p.id === value) || null}
                  disabled={isShow}
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Proceso'
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                  onChange={(_, newValue) => {
                    onChange(newValue ? newValue.id : null);
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={6}>
            <Controller
              control={form.control}
              name='speed_mh'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Velocidad (m/h)'
                  type='number'
                  error={!!error}
                  helperText={error?.message}
                  disabled={isShow}
                  value={field.value ?? ''}
                  onKeyDown={e => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={e =>
                    field.onChange(
                      e.target.value === '' ? null : +e.target.value
                    )
                  }
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              control={form.control}
              name='speed_kgh'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Velocidad (kg/h)'
                  type='number'
                  error={!!error}
                  helperText={error?.message}
                  disabled={isShow}
                  value={field.value ?? ''}
                  onKeyDown={e => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={e =>
                    field.onChange(
                      e.target.value === '' ? null : +e.target.value
                    )
                  }
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              control={form.control}
              name='circumference_total'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Circunferencia Total'
                  type='number'
                  error={!!error}
                  helperText={error?.message}
                  disabled={isShow}
                  value={field.value ?? ''}
                  onKeyDown={e => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={e =>
                    field.onChange(
                      e.target.value === '' ? null : +e.target.value
                    )
                  }
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              control={form.control}
              name='max_width'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Ancho Máximo'
                  type='number'
                  error={!!error}
                  helperText={error?.message}
                  disabled={isShow}
                  value={field.value ?? ''}
                  onKeyDown={e => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={e =>
                    field.onChange(
                      e.target.value === '' ? null : +e.target.value
                    )
                  }
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              control={form.control}
              name='max_center'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Centro Máximo'
                  type='number'
                  error={!!error}
                  helperText={error?.message}
                  disabled={isShow}
                  value={field.value ?? ''}
                  onKeyDown={e => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={e =>
                    field.onChange(
                      e.target.value === '' ? null : +e.target.value
                    )
                  }
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
    </CustomDrawer>
  );
};
