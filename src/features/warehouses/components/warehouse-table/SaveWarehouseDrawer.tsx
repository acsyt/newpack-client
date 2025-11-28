import { useMemo, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel
} from '@mui/material';
import { DefaultValues, useForm, Controller } from 'react-hook-form';

import { CustomDrawer } from '@/components/shared/CustomDrawer';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { Environment } from '@/config/env';
import { ErrorMapper } from '@/config/error.mapper';
import { FormHelper } from '@/config/helpers/form.helper';
import { customFaker } from '@/config/utils/faker.util';
import { useSaveWarehouseMutation } from '@/features/warehouses/hooks/warehouses.query';
import { useWarehouseDrawerStore } from '@/features/warehouses/store/useWarehouseDrawerStore';
import {
  WarehouseParams,
  WAREHOUSE_TYPES
} from '@/features/warehouses/warehouse.interface';
import {
  WarehouseDto,
  warehouseSchema
} from '@/features/warehouses/warehouse.schema';

interface SaveWarehouseDrawerProps {
  warehouseParams: WarehouseParams;
}

const WAREHOUSE_TYPE_OPTIONS = [
  { value: WAREHOUSE_TYPES.MAIN, label: 'Principal' },
  { value: WAREHOUSE_TYPES.SECONDARY, label: 'Secundario' },
  { value: WAREHOUSE_TYPES.STORE, label: 'Mostrador' }
];

export const SaveWarehouseDrawer = ({
  warehouseParams
}: SaveWarehouseDrawerProps) => {
  const { isOpen, onClose, item, mode } = useWarehouseDrawerStore();

  const isProd = Environment.isProd;
  const isShow = mode === ModeAction.Show;

  const mutation = useSaveWarehouseMutation({
    mode,
    id: item?.id || undefined,
    warehouseParams
  });

  const defaultValues = useMemo<DefaultValues<WarehouseDto>>(() => {
    if (item && mode !== ModeAction.Create) {
      return {
        mode,
        id: +item.id,
        name: item.name,
        type: item.type,
        active: item.active
      };
    }

    if (isProd) {
      return {
        mode: ModeAction.Create,
        name: '',
        type: WAREHOUSE_TYPES.MAIN,
        active: true
      };
    }

    return {
      mode: ModeAction.Create,
      name: `Almacén ${customFaker.location.city()}`,
      type: customFaker.helpers.arrayElement(Object.values(WAREHOUSE_TYPES)),
      active: customFaker.datatype.boolean()
    };
  }, [item, mode, isProd]);

  const form = useForm<WarehouseDto>({
    resolver: zodResolver(warehouseSchema),
    defaultValues
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const title = {
    [ModeAction.Create]: 'Crear Almacén',
    [ModeAction.Edit]: 'Editar Almacén',
    [ModeAction.Show]: 'Detalle Almacén'
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
              name='name'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Nombre'
                  error={!!error}
                  helperText={error?.message}
                  disabled={isShow}
                  placeholder='Ej: Almacén Central'
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={form.control}
              name='type'
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error} disabled={isShow}>
                  <InputLabel id='type-label'>Tipo</InputLabel>
                  <Select
                    {...field}
                    labelId='type-label'
                    label='Tipo'
                    value={field.value || ''}
                  >
                    {WAREHOUSE_TYPE_OPTIONS.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={form.control}
              name='active'
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      disabled={isShow}
                      onChange={e => field.onChange(e.target.checked)}
                    />
                  }
                  label='Activo'
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
    </CustomDrawer>
  );
};
