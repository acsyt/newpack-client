import { useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { Controller, DefaultValues, useForm, useWatch } from 'react-hook-form';

import { useSaveInventoryMovementMutation } from '../../hooks/inventory-movements.query';
import { MovementType } from '../../inventory-movement.interface';
import {
  InventoryMovementDto,
  inventoryMovementSchema
} from '../../inventory-movement.schema';
import { useInventoryMovementDrawerStore } from '../../store/useInventoryMovementDrawerStore';

import { CustomDrawer } from '@/components/shared/CustomDrawer';
import { ErrorMapper } from '@/config/error.mapper';
import { FormHelper } from '@/config/helpers/form.helper';
import { useProductsQuery } from '@/features/products/hooks/products.query';
import {
  useWarehouseLocationsQuery,
  useWarehousesQuery
} from '@/features/warehouses/hooks/warehouses.query';

const MOVEMENT_TYPES = [
  { value: MovementType.Entry, label: 'Entrada', type: 'entry' },
  { value: MovementType.Exit, label: 'Salida', type: 'exit' },
  { value: MovementType.Transfer, label: 'Transferencia', type: 'transfer' }
];

export const SaveInventoryMovementDrawer = () => {
  const { isOpen, onClose, movementType } = useInventoryMovementDrawerStore();
  const mutation = useSaveInventoryMovementMutation();

  const { data: productsData } = useProductsQuery({
    options: {
      has_pagination: false,
      include: ['productType']
    }
  });
  const products = productsData?.data || [];

  const { data: warehousesData } = useWarehousesQuery({
    options: { has_pagination: false }
  });
  const warehouses = warehousesData?.data || [];

  const defaultValues = useMemo<DefaultValues<InventoryMovementDto>>(
    () => ({
      product_id: undefined,
      warehouse_id: undefined,
      warehouse_location_id: null,
      batch_id: '',
      type: undefined,
      quantity: undefined,
      notes: ''
    }),
    []
  );

  const form = useForm<InventoryMovementDto>({
    resolver: zodResolver(inventoryMovementSchema),
    defaultValues: defaultValues
  });

  const selectedWarehouseId = useWatch({
    control: form.control,
    name: 'warehouse_id'
  });

  const { data: locationsData } = useWarehouseLocationsQuery({
    options: {
      has_pagination: false,
      filter: { warehouse_id: selectedWarehouseId ? [selectedWarehouseId] : [] }
    },
    enabled: !!selectedWarehouseId
  });
  const locations = locationsData?.data || [];

  useEffect(() => {
    if (isOpen && movementType) {
      form.reset({
        ...defaultValues,
        type: movementType
      });
    }
  }, [isOpen, movementType, form, defaultValues]);

  const title = useMemo(() => {
    if (movementType === MovementType.Entry) return 'Nueva Entrada';
    if (movementType === MovementType.Exit) return 'Nueva Salida';
    if (movementType === MovementType.Transfer) return 'Nueva Transferencia';

    return 'Nuevo Movimiento';
  }, [movementType]);

  const availableTypes = useMemo(() => {
    if (!movementType) return MOVEMENT_TYPES;

    return MOVEMENT_TYPES.filter(t => t.value === movementType);
  }, [movementType]);

  const handleSubmit = (data: InventoryMovementDto) => {
    mutation.mutate(data, {
      onSuccess: () => {
        onClose();
        form.reset();
      },
      onError: error => {
        const errors = ErrorMapper.mapErrorToApiResponse(error);

        FormHelper.setFormErrors(errors.errors, form.setError);
      }
    });
  };

  return (
    <CustomDrawer
      open={isOpen}
      title={title}
      footer={
        <Button
          fullWidth
          variant='contained'
          color='primary'
          size='large'
          disabled={mutation.isPending}
          onClick={form.handleSubmit(handleSubmit)}
        >
          {mutation.isPending ? 'Guardando...' : 'Guardar'}
        </Button>
      }
      onClose={onClose}
    >
      <form className='flex flex-col h-full'>
        <Grid container spacing={2.5}>
          {/* Producto */}
          <Grid size={12}>
            <Controller
              control={form.control}
              name='product_id'
              render={({
                field: { onChange, value },
                fieldState: { error }
              }) => (
                <Autocomplete
                  options={products.sort((a, b) =>
                    (a.productType?.name || '').localeCompare(
                      b.productType?.name || ''
                    )
                  )}
                  groupBy={option => option.productType?.name || 'Sin Tipo'}
                  getOptionLabel={option => `${option.sku} - ${option.name}`}
                  value={products.find(p => p.id === value) || null}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Producto'
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                  onChange={(_, newValue) =>
                    onChange(newValue ? newValue.id : undefined)
                  }
                />
              )}
            />
          </Grid>

          {/* Almacén */}
          <Grid size={12}>
            <Controller
              control={form.control}
              name='warehouse_id'
              render={({
                field: { onChange, value },
                fieldState: { error }
              }) => (
                <Autocomplete
                  options={warehouses}
                  getOptionLabel={option => option.name}
                  value={warehouses.find(w => w.id === value) || null}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Almacén'
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                  onChange={(_, newValue) => {
                    onChange(newValue ? newValue.id : undefined);
                    form.setValue('warehouse_location_id', null); // Reset location
                  }}
                />
              )}
            />
          </Grid>

          {/* Ubicación (dependiente de Almacén) */}
          <Grid size={12}>
            <Controller
              control={form.control}
              name='warehouse_location_id'
              render={({
                field: { onChange, value },
                fieldState: { error }
              }) => (
                <Autocomplete
                  options={locations}
                  getOptionLabel={option =>
                    `${option.aisle}-${option.shelf}-${option.section}`
                  }
                  value={locations.find(l => l.id === value) || null}
                  disabled={!selectedWarehouseId}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Ubicación'
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                  onChange={(_, newValue) =>
                    onChange(newValue ? newValue.id : null)
                  }
                />
              )}
            />
          </Grid>

          {/* Tipo de Movimiento */}
          <Grid size={12}>
            <Controller
              control={form.control}
              name='type'
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel id='type-label'>Tipo de Movimiento</InputLabel>
                  <Select
                    {...field}
                    labelId='type-label'
                    label='Tipo de Movimiento'
                    value={field.value || ''}
                  >
                    {availableTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          {/* Lote */}
          <Grid size={12}>
            <Controller
              control={form.control}
              name='batch_id'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Lote (Opcional)'
                  error={!!error}
                  helperText={error?.message}
                  value={field.value || ''}
                />
              )}
            />
          </Grid>

          {/* Cantidad */}
          <Grid size={12}>
            <Controller
              control={form.control}
              name='quantity'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Cantidad'
                  type='number'
                  error={!!error}
                  helperText={error?.message}
                  value={field.value ?? ''}
                  onChange={e =>
                    field.onChange(
                      e.target.value === '' ? undefined : +e.target.value
                    )
                  }
                />
              )}
            />
          </Grid>

          {/* Notas */}
          <Grid size={12}>
            <Controller
              control={form.control}
              name='notes'
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  label='Notas'
                  rows={3}
                  error={!!error}
                  helperText={error?.message}
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
