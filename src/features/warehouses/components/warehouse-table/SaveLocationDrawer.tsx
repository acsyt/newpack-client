import { useMemo, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Drawer,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid
} from '@mui/material';
import { X } from 'lucide-react';
import { DefaultValues, useForm, Controller } from 'react-hook-form';

import { useSaveWarehouseLocationMutation } from '../../hooks/warehouses.query';
import { WarehouseLocation } from '../../warehouse.interface';
import {
  WarehouseLocationDto,
  warehouseLocationSchema
} from '../../warehouse.schema';

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

  return (
    <Drawer
      open={isOpen}
      anchor='right'
      ModalProps={{
        keepMounted: false,
        disablePortal: false
      }}
      slotProps={{
        backdrop: {
          sx: { zIndex: 1500 }
        }
      }}
      PaperProps={{
        className:
          'w-[calc(100%-16px)] sm:w-[400px] m-1 h-[calc(100%-16px)] sm:h-[calc(100%-32px)] rounded-xl border border-divider shadow-2xl',
        sx: { zIndex: 1501 }
      }}
      sx={{ zIndex: 1501 }}
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
                [ModeAction.Create]: 'Nueva Ubicación',
                [ModeAction.Edit]: 'Editar Ubicación',
                [ModeAction.Show]: 'Detalle Ubicación'
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
