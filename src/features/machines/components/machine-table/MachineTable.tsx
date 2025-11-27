import type { FC } from 'react';

import { useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Eye, Pencil, Plus, X } from 'lucide-react';
import { Controller, DefaultValues, useForm } from 'react-hook-form';

import { MachineDto, machineSchema } from '../../machine.schema';

import { machineColumns } from './columns';

import { CustomTable } from '@/components/shared/CustomTable';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { Environment } from '@/config/env';
import { customFaker } from '@/config/utils/faker.util';
import { useAuth } from '@/features/auth/hooks/mutations';
import { useMachinesQuery } from '@/features/machines/hooks/machines.query';
import { Machine } from '@/features/machines/machine.interface';
import { useProcessesQuery } from '@/features/processes/hooks/processes.query';
import { createDrawerStore } from '@/hooks/useDrawerStore';

interface MachineTableProps {}

const useMachineDrawerStore = createDrawerStore<Machine>();

export const MachineTable: FC<MachineTableProps> = ({}) => {
  const { permissions } = useAuth();
  const memoizedColumns = useMemo(() => machineColumns, []);

  const { isOpen, onCreate } = useMachineDrawerStore();

  return (
    <>
      <CustomTable
        queryHook={useMachinesQuery}
        queryProps={{
          options: {
            include: ['process']
          }
        }}
        columns={memoizedColumns}
        positionActionsColumn='last'
        renderTopToolbarCustomActions={() => (
          <Box display='flex' gap={1}>
            {permissions.includes('machines.create') && (
              <Button
                variant='contained'
                color='primary'
                startIcon={<Plus size={18} />}
                onClick={onCreate}
              >
                Crear maquina
              </Button>
            )}
          </Box>
        )}
        renderRowActions={({ row }) => (
          <MachineRowAction machine={row.original} />
        )}
      />

      <SaveMachineDrawer />
    </>
  );
};

interface MachineRowActionProps {
  machine: Machine;
}
const MachineRowAction: FC<MachineRowActionProps> = ({ machine }) => {
  const { permissions } = useAuth();
  const { onEdit, onShow } = useMachineDrawerStore();

  return (
    <Box display='flex' gap={1}>
      {permissions.includes('machines.show') && (
        <Tooltip title='Show'>
          <IconButton onClick={() => onShow(machine)}>
            <Eye size={18} />
          </IconButton>
        </Tooltip>
      )}
      {permissions.includes('machines.edit') && (
        <Tooltip title={'Edit'}>
          <IconButton onClick={() => onEdit(machine)}>
            <Pencil size={18} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

interface SaveMachineDrawerProps {}

const SaveMachineDrawer = ({}: SaveMachineDrawerProps) => {
  const { isOpen, onClose, item, mode } = useMachineDrawerStore();

  const isProd = Environment.isProd;

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
      process_id: customFaker.number.int({ min: 1, max: processes.length })
    };
  }, [item, mode, isProd, processes]);

  const form = useForm<MachineDto>({
    resolver: zodResolver(machineSchema),
    defaultValues
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer
      open={isOpen}
      anchor='right'
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : 400
        }
      }}
      onClose={onClose}
    >
      <form
        onSubmit={form.handleSubmit(_data => {
          // Handle submit
        })}
      >
        <Grid container spacing={2} p={2}>
          <Grid size={12}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <Typography variant='h6'>
                {
                  {
                    [ModeAction.Create]: 'Crear Máquina',
                    [ModeAction.Edit]: 'Editar Máquina',
                    [ModeAction.Show]: 'Detalle Máquina'
                  }[mode]
                }
              </Typography>
              <IconButton onClick={onClose}>
                <X size={20} />
              </IconButton>
            </Box>
          </Grid>

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

          <Grid size={12}>
            <Button fullWidth type='submit' variant='contained' color='primary'>
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Drawer>
  );
};
