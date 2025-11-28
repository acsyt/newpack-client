import { useMemo, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Grid } from '@mui/material';
import { DefaultValues, useForm, Controller } from 'react-hook-form';

import { useSaveWarehouseLocationMutation } from '../../hooks/warehouses.query';
import { WarehouseLocation } from '../../warehouse.interface';
import {
  WarehouseLocationDto,
  warehouseLocationSchema
} from '../../warehouse.schema';

import { CustomDrawer } from '@/components/shared/CustomDrawer';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { Environment } from '@/config/env';
import { ErrorMapper } from '@/config/error.mapper';
import { FormHelper } from '@/config/helpers/form.helper';
import { customFaker } from '@/config/utils/faker.util';

interface SaveLocationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModeAction;
  warehouseId: number;
  location?: WarehouseLocation;
}

export const SaveLocationDrawer = ({
  isOpen,
  onClose,
  mode,
  warehouseId,
  location
}: SaveLocationDrawerProps) => {
  const isProd = Environment.isProd;
  const isShow = mode === ModeAction.Show;

  const mutation = useSaveWarehouseLocationMutation({
    mode,
    id: location?.id || undefined,
    warehouseId
  });

  const defaultValues = useMemo<DefaultValues<WarehouseLocationDto>>(() => {
    if (location && mode !== ModeAction.Create) {
      return {
        mode,
        id: +location.id,
        warehouse_id: warehouseId,
        aisle: location.aisle || '',
        shelf: location.shelf || '',
        section: location.section || ''
      };
    }

    if (isProd) {
      return {
        mode: ModeAction.Create,
        warehouse_id: warehouseId,
        aisle: '',
        shelf: '',
        section: ''
      };
    }

    return {
      mode: ModeAction.Create,
      warehouse_id: warehouseId,
      aisle: `A-${customFaker.number.int({ min: 1, max: 99 }).toString().padStart(2, '0')}`,
      shelf: `S-${customFaker.number.int({ min: 1, max: 99 }).toString().padStart(2, '0')}`,
      section: `L-${customFaker.number.int({ min: 1, max: 99 }).toString().padStart(2, '0')}`
    };
  }, [location, mode, isProd, warehouseId]);

  const form = useForm<WarehouseLocationDto>({
    resolver: zodResolver(warehouseLocationSchema),
    defaultValues
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const title = {
    [ModeAction.Create]: 'Nueva Ubicación',
    [ModeAction.Edit]: 'Editar Ubicación',
    [ModeAction.Show]: 'Detalle Ubicación'
  }[mode];

  return (
    <CustomDrawer
      open={isOpen}
      title={title}
      width={400}
      sx={{ zIndex: 1501 }}
      slotProps={{
        backdrop: {
          sx: { zIndex: 1500 }
        }
      }}
      PaperProps={{
        sx: { zIndex: 1501 }
      }}
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
              name='aisle'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Pasillo'
                  error={!!error}
                  helperText={error?.message}
                  disabled={isShow}
                  placeholder='Ej: A-01'
                  value={field.value || ''}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={form.control}
              name='shelf'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Estante'
                  error={!!error}
                  helperText={error?.message}
                  disabled={isShow}
                  placeholder='Ej: S-02'
                  value={field.value || ''}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={form.control}
              name='section'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Sección'
                  error={!!error}
                  helperText={error?.message}
                  disabled={isShow}
                  placeholder='Ej: L-03'
                  value={field.value || ''}
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
    </CustomDrawer>
  );
};
