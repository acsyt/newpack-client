import { useMemo, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Drawer,
  Typography,
  IconButton,
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
import { X } from 'lucide-react';
import { DefaultValues, useForm, Controller } from 'react-hook-form';

import { ModeAction } from '@/config/enums/mode-action.enum';
import { Environment } from '@/config/env';
import { ErrorMapper } from '@/config/error.mapper';
import { FormHelper } from '@/config/helpers/form.helper';
import { cn } from '@/config/utils/cn.util';
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

  return (
    <Drawer
      open={isOpen}
      anchor='right'
      slotProps={{
        paper: {
          className: cn(
            'w-[calc(100%-16px)] sm:w-[450px] m-1 h-[calc(100%-16px)] sm:h-[calc(100%-32px)]',
            'rounded-xl border border-divider shadow-2xl'
          )
        }
      }}
      onClose={onClose}
    >
      <form
        className='flex flex-col h-full'
        onSubmit={form.handleSubmit(data => {
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
        <div className='p-5 flex items-center justify-between border-b border-divider'>
          <Typography variant='h6' fontWeight={600}>
            {
              {
                [ModeAction.Create]: 'Crear Almacén',
                [ModeAction.Edit]: 'Editar Almacén',
                [ModeAction.Show]: 'Detalle Almacén'
              }[mode]
            }
          </Typography>
          <IconButton size='small' onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>

        <div className='flex-1 overflow-auto p-6'>
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
        </div>

        {![ModeAction.Show].includes(mode) && (
          <div className='p-5 border-t border-divider'>
            <Button
              fullWidth
              type='submit'
              variant='contained'
              color='primary'
              size='large'
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        )}
      </form>
    </Drawer>
  );
};
