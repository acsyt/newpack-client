import { useMemo, useEffect, FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Plus, Save, ArrowRightCircle } from 'lucide-react';
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  FormProvider
} from 'react-hook-form';
import { toast } from 'sonner';

import { TransferRow } from './TransferRow';

import { ErrorMapper, getErrorMessage } from '@/config/error.mapper';
import { FormHelper } from '@/config/helpers/form.helper';
import {
  InventoryTransferDto,
  inventoryTransferSchema
} from '@/features/inventory-movements/inventory-movement.schema';
import { useShipTransferMutation } from '@/features/transfers/hooks/transfers.query';
import {
  useWarehouseLocationsQuery,
  useWarehousesQuery
} from '@/features/warehouses/hooks/warehouses.query';

export const invisibleInputSx = (error: boolean) => ({
  bgcolor: error ? '#FEF2F2' : 'transparent',
  borderRadius: 1,
  px: 1,
  transition: 'all 0.2s',
  '&:hover': { bgcolor: '#F8FAFC', boxShadow: '0 0 0 1px #E2E8F0 inset' },
  '&.Mui-focused': { bgcolor: 'white', boxShadow: '0 0 0 1px #3B82F6 inset' }
});

interface CreateTransferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTransferDrawer: FC<CreateTransferDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const mutation = useShipTransferMutation();

  const form = useForm<InventoryTransferDto>({
    mode: 'onChange',
    resolver: zodResolver(
      inventoryTransferSchema.superRefine((data, ctx) => {
        if (data.products.length === 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['products'],
            message: 'Al menos debe agregar un producto'
          });
        }
      })
    ),
    defaultValues: {
      source_warehouse_id: undefined,
      destination_warehouse_id: undefined,
      notes: '',
      products: [{ product_id: undefined, quantity: undefined, batch_id: null }]
    }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'products'
  });

  const sourceWarehouseId = useWatch({
    control: form.control,
    name: 'source_warehouse_id'
  });
  const destWarehouseId = useWatch({
    control: form.control,
    name: 'destination_warehouse_id'
  });

  useEffect(() => {
    replace([
      {
        product_id: undefined as any,
        quantity: undefined as any,
        source_location_id: undefined as any,
        destination_location_id: undefined as any,
        batch_id: null
      }
    ]);
  }, [sourceWarehouseId, replace]);

  const { data: warehousesData } = useWarehousesQuery({
    options: { has_pagination: false }
  });
  const warehouses = useMemo(
    () => warehousesData?.data || [],
    [warehousesData]
  );

  const { data: destLocationsData, isSuccess: isDestLocationsSuccess } =
    useWarehouseLocationsQuery({
      options: {
        has_pagination: false,
        filter: { warehouse_id: destWarehouseId ? [destWarehouseId] : [] }
      },
      enabled: !!destWarehouseId
    });
  const sortedWarehouses = useMemo(() => {
    return [...warehouses].sort((a, b) => {
      const stockA = a.stocksCount || 0;
      const stockB = b.stocksCount || 0;

      return stockB - stockA;
    });
  }, [warehouses]);

  const sortedDestWarehouses = useMemo(() => {
    return [...warehouses].sort((a, b) => {
      const locA = a.warehouseLocationsCount || 0;
      const locB = b.warehouseLocationsCount || 0;

      return locB - locA;
    });
  }, [warehouses]);

  const destLocations = destLocationsData?.data || [];

  const destWarehouseHasNoLocations =
    !!destWarehouseId && isDestLocationsSuccess && destLocations.length === 0;
  const selectedSourceWarehouse = warehouses.find(
    w => w.id === sourceWarehouseId
  );
  const sourceWarehouseHasNoProducts =
    !!sourceWarehouseId && selectedSourceWarehouse?.stocksCount === 0;

  const onCreateNewProduct = () => {
    append({
      product_id: undefined as any,
      quantity: undefined as any,
      source_location_id: undefined as any,
      destination_location_id: undefined as any,
      batch_id: null
    });
  };

  const handleSubmit = (data: InventoryTransferDto) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('Transferencia enviada exitosamente');
        onClose();
        form.reset();
      },
      onError: (error: any) => {
        const message = getErrorMessage(error);

        toast.error(message);
        const errors = ErrorMapper.mapErrorToApiResponse(error);

        FormHelper.setFormErrors(errors.errors, form.setError);
      }
    });
  };

  return (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth='lg'
      PaperProps={{ sx: { maxWidth: '1100px' } }}
      onClose={onClose}
    >
      <DialogTitle>Nueva Transferencia</DialogTitle>
      <DialogContent dividers>
        <FormProvider {...form}>
          <Box className='flex flex-col gap-6'>
            <Box className='flex flex-col gap-6 p-2.5 border border-gray-200 rounded-lg bg-gray-50'>
              <Grid container spacing={3} alignItems='center'>
                <Grid size={{ xs: 5 }}>
                  <Controller
                    name='source_warehouse_id'
                    control={form.control}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        options={sortedWarehouses}
                        getOptionLabel={w => w.name}
                        value={
                          warehouses.find(w => w.id === field.value) || null
                        }
                        renderOption={(props, option) => (
                          <li {...props}>
                            <div className='flex flex-col'>
                              <span className='text-sm font-medium text-gray-900'>
                                {option.name}
                              </span>
                              {(option.stocksCount || 0) > 0 ? (
                                <span className='text-xs font-semibold text-green-600'>
                                  {option.stocksCount} productos en stock
                                </span>
                              ) : (
                                <span className='text-xs text-gray-500'>
                                  Sin stock
                                </span>
                              )}
                            </div>
                          </li>
                        )}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Almacén Origen'
                            error={!!error}
                            helperText={error?.message}
                            size='small'
                          />
                        )}
                        onChange={(_, d) => field.onChange(d?.id)}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 2 }} display='flex' justifyContent='center'>
                  <ArrowRightCircle
                    className='text-slate-400'
                    size={28}
                    strokeWidth={1.5}
                  />
                </Grid>
                <Grid size={{ xs: 5 }}>
                  <Controller
                    name='destination_warehouse_id'
                    control={form.control}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        options={sortedDestWarehouses.filter(
                          w => w.id !== sourceWarehouseId
                        )}
                        getOptionLabel={w => w.name}
                        value={
                          warehouses.find(w => w.id === field.value) || null
                        }
                        renderOption={(props, option) => (
                          <li {...props}>
                            <div className='flex flex-col'>
                              <span className='text-sm font-medium text-gray-900'>
                                {option.name}
                              </span>
                              {(option.warehouseLocationsCount || 0) > 0 ? (
                                <span className='text-xs font-semibold text-blue-600'>
                                  {option.warehouseLocationsCount} ubicaciones
                                </span>
                              ) : (
                                <span className='text-xs font-semibold text-red-600'>
                                  Sin ubicaciones (Solo recepción general)
                                </span>
                              )}
                            </div>
                          </li>
                        )}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Almacén Destino'
                            error={!!error}
                            helperText={error?.message}
                            size='small'
                          />
                        )}
                        onChange={(_, d) => field.onChange(d?.id)}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {sourceWarehouseHasNoProducts && (
                <Alert severity='warning' sx={{ mt: 2, py: 0 }}>
                  Nota: El almacén de origen seleccionado no tiene productos
                  registrados.
                </Alert>
              )}

              {destWarehouseHasNoLocations && (
                <Alert severity='warning' sx={{ mt: 2, py: 0 }}>
                  Nota: El almacén de destino seleccionado no tiene ubicaciones
                  configuradas. Podrás enviar, pero no asignar ubicación de
                  llegada.
                </Alert>
              )}
            </Box>

            <Box>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mb={1.5}
              >
                <Typography
                  variant='subtitle2'
                  color='text.primary'
                  fontWeight={600}
                >
                  Detalle de Productos
                </Typography>
                <Button
                  size='small'
                  disabled={!sourceWarehouseId}
                  startIcon={<Plus size={16} />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                  onClick={onCreateNewProduct}
                >
                  Agregar Fila
                </Button>
              </Box>

              <TableContainer
                component={Paper}
                variant='outlined'
                sx={{ borderRadius: 2, maxHeight: '55vh' }}
              >
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow
                      sx={{ '& th': { bgcolor: '#F1F5F9', fontWeight: 600 } }}
                    >
                      <TableCell width='35%'>
                        Producto (Stock Disponible)
                      </TableCell>
                      <TableCell width='15%'>Cantidad</TableCell>
                      <TableCell width='20%'>Ubic. Origen</TableCell>
                      <TableCell width='20%'>Ubic. Destino</TableCell>
                      <TableCell width='5%' align='center' />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!sourceWarehouseId ? (
                      <TableRow>
                        <TableCell colSpan={5} align='center' sx={{ py: 6 }}>
                          <Typography variant='body2' color='text.secondary'>
                            Seleccione un almacén de origen para comenzar
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      fields.map((field, index) => (
                        <TransferRow
                          key={field.id}
                          index={index}
                          remove={remove}
                          isSingleRow={fields.length === 1}
                          destLocations={destLocations}
                          sourceWarehouseId={sourceWarehouseId}
                          destWarehouseId={destWarehouseId}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>

                <Button
                  fullWidth
                  disabled={!sourceWarehouseId}
                  variant='text'
                  startIcon={<Plus size={16} />}
                  sx={{
                    borderRadius: 0,
                    py: 1.5,
                    color: 'text.secondary',
                    borderTop: '1px dashed #E2E8F0',
                    '&:hover': { bgcolor: '#F8FAFC', color: 'primary.main' }
                  }}
                  onClick={onCreateNewProduct}
                >
                  Click para agregar nueva línea
                </Button>
              </TableContainer>
            </Box>

            <TextField
              {...form.register('notes')}
              multiline
              fullWidth
              label='Observaciones Generales'
              rows={2}
              placeholder='Escribe aquí cualquier detalle adicional...'
              variant='outlined'
              size='small'
            />
          </Box>
        </FormProvider>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button color='inherit' onClick={onClose}>
          Cancelar
        </Button>
        <Button
          disableElevation
          variant='contained'
          disabled={mutation.isPending || !form.formState.isValid}
          startIcon={<Save size={18} />}
          onClick={form.handleSubmit(handleSubmit)}
        >
          {mutation.isPending ? 'Procesando...' : 'Enviar Transferencia'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
