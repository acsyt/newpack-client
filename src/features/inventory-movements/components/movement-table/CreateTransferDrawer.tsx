import { useState, useMemo, useEffect, FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert'; // <--- NUEVO IMPORT
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Plus, Trash2, Save, ArrowRightCircle } from 'lucide-react';
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  useFormContext,
  FormProvider
} from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { ErrorMapper, getErrorMessage } from '@/config/error.mapper';
import { FormHelper } from '@/config/helpers/form.helper';
import {
  InventoryTransferDto,
  inventoryTransferSchema
} from '@/features/inventory-movements/inventory-movement.schema';
import { useInventoryStocksQuery } from '@/features/inventory-stocks/hooks/inventory-stocks.query';
import { InventoryStockParams } from '@/features/inventory-stocks/inventory-stock.interface';
import { useShipTransferMutation } from '@/features/transfers/hooks/transfers.query';
import {
  useWarehouseLocationsQuery,
  useWarehousesQuery
} from '@/features/warehouses/hooks/warehouses.query';
import { WarehouseLocation } from '@/features/warehouses/warehouse.interface';

// ... (Estilos invisibleInputSx igual que antes) ...
const invisibleInputSx = (error: boolean) => ({
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

  // 1. Resetear filas si cambia el origen
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
  const warehouses = warehousesData?.data || [];

  const { data: destLocationsData } = useWarehouseLocationsQuery({
    options: {
      has_pagination: false,
      filter: { warehouse_id: destWarehouseId ? [destWarehouseId] : [] }
    },
    enabled: !!destWarehouseId
  });
  const destLocations = destLocationsData?.data || [];

  // Nuevo: Detectar si el destino no tiene ubicaciones para mostrar alerta
  const destWarehouseHasNoLocations =
    !!destWarehouseId && destLocations.length === 0;

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
            {/* Header de Almacenes */}
            <Box
              sx={{
                p: 2.5,
                border: '1px solid #E2E8F0',
                borderRadius: 2,
                bgcolor: '#F8FAFC'
              }}
            >
              <Grid container spacing={3} alignItems='center'>
                <Grid size={{ xs: 5 }}>
                  <Controller
                    name='source_warehouse_id'
                    control={form.control}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        options={warehouses}
                        getOptionLabel={w => w.name}
                        value={
                          warehouses.find(w => w.id === field.value) || null
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Almacén Origen'
                            error={!!error}
                            helperText={error?.message}
                            size='small'
                            sx={{ bgcolor: 'white' }}
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
                        options={warehouses.filter(
                          w => w.id !== sourceWarehouseId
                        )}
                        getOptionLabel={w => w.name}
                        value={
                          warehouses.find(w => w.id === field.value) || null
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Almacén Destino'
                            error={!!error}
                            helperText={error?.message}
                            size='small'
                            sx={{ bgcolor: 'white' }}
                          />
                        )}
                        onChange={(_, d) => field.onChange(d?.id)}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Alerta si el destino no tiene ubicaciones */}
              {destWarehouseHasNoLocations && (
                <Alert severity='warning' sx={{ mt: 2, py: 0 }}>
                  Nota: El almacén de destino seleccionado no tiene ubicaciones
                  configuradas. Podrás enviar, pero no asignar ubicación de
                  llegada.
                </Alert>
              )}
            </Box>

            {/* Tabla de Productos */}
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

// ----------------------------------------------------------------------
// SUB COMPONENT: TRANSFER ROW
// ----------------------------------------------------------------------

interface TransferRowProps {
  index: number;
  remove: (index: number) => void;
  destLocations: WarehouseLocation[];
  sourceWarehouseId?: number;
  destWarehouseId?: number;
  isSingleRow: boolean;
}

const TransferRow: FC<TransferRowProps> = ({
  index,
  remove,
  destLocations,
  sourceWarehouseId,
  destWarehouseId,
  isSingleRow
}) => {
  const {
    control,
    setValue,
    getValues,
    trigger,
    setError,
    clearErrors,
    formState: { errors }
  } = useFormContext<InventoryTransferDto>();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStockObj, setSelectedStockObj] = useState<any>(null);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const productId = useWatch({ control, name: `products.${index}.product_id` });
  const sourceLocationId = useWatch({
    control,
    name: `products.${index}.source_location_id`
  });
  const batchId = useWatch({ control, name: `products.${index}.batch_id` });

  const stockQueryOptions = useMemo<InventoryStockParams>(
    () => ({
      filter: {
        warehouse_id: sourceWarehouseId ? [sourceWarehouseId] : [],
        search: debouncedSearchTerm
      },
      include: [
        'product',
        'warehouseLocation',
        'batch',
        'product.productType'
      ] as const,
      per_page: 50
    }),
    [sourceWarehouseId, debouncedSearchTerm]
  );

  const { data: stocksData, isLoading: isLoadingStocks } =
    useInventoryStocksQuery({
      options: stockQueryOptions,
      enabled: !!sourceWarehouseId
    });

  // --- CORRECCIÓN CRÍTICA: Filtrar productos sin stock ---
  const remoteStocks = useMemo(
    () =>
      (stocksData?.data || []).filter(s => {
        const status = s.status?.toLowerCase() || '';
        const qty = Number(s.quantity) || 0;

        // Solo mostramos si está disponible Y tiene más de 0
        return status === 'available' && qty > 0;
      }),
    [stocksData]
  );

  const options = useMemo(() => {
    const list = [...remoteStocks];

    if (selectedStockObj && !list.find(s => s.id === selectedStockObj.id)) {
      list.push(selectedStockObj);
    }

    return list;
  }, [remoteStocks, selectedStockObj]);

  useEffect(() => {
    if (productId && !selectedStockObj && remoteStocks.length > 0) {
      const found = remoteStocks.find(
        s => s.productId === productId && s.batchId === batchId
      );

      if (found) setSelectedStockObj(found);
    }
  }, [productId, remoteStocks, selectedStockObj, batchId]);

  const currentStockLimit = selectedStockObj?.quantity || 0;

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      {/* 1. Selección de Producto */}
      <TableCell sx={{ verticalAlign: 'top', p: 1 }}>
        <Autocomplete
          options={options}
          groupBy={option =>
            option.product?.productType?.name || 'Sin Categoría'
          }
          getOptionLabel={s => {
            if (!s.product) return '';
            const batchInfo = s.batch
              ? ` | Lote: ${s.batch.code} (Vence: ${s.batch.expirationDate ?? 'N/A'})`
              : '';

            return `${s.product.sku} - ${s.product.name}${batchInfo} (Disp: ${Number(s.quantity).toFixed(2)})`;
          }}
          loading={isLoadingStocks}
          value={selectedStockObj || null}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          // Mensaje cuando no hay stock en el almacén
          noOptionsText={
            searchTerm
              ? 'No encontrado'
              : 'Sin stock disponible en este almacén'
          }
          renderInput={params => (
            <TextField
              {...params}
              placeholder={sourceWarehouseId ? 'Buscar item...' : '---'}
              variant='standard'
              disabled={!sourceWarehouseId}
              InputProps={{ ...params.InputProps, disableUnderline: true }}
              sx={invisibleInputSx(false)}
            />
          )}
          filterOptions={x => x}
          onChange={(_, stock) => {
            // ... (Lógica igual que antes) ...
            if (stock) {
              const currentProducts = getValues().products;
              const isDuplicate = currentProducts.some(
                (p, idx) =>
                  idx !== index &&
                  p.product_id === stock.productId &&
                  p.source_location_id === stock.warehouseLocationId &&
                  p.batch_id === stock.batchId
              );

              if (isDuplicate) {
                setError(`products.${index}.product_id`, {
                  type: 'manual',
                  message: 'Ya agregado en otra fila'
                });
                setSelectedStockObj(null);
                setTimeout(
                  () => clearErrors(`products.${index}.product_id`),
                  3000
                );

                return;
              }
              setSelectedStockObj(stock);
              setValue(`products.${index}.product_id`, stock.productId);
              setValue(
                `products.${index}.source_location_id`,
                stock.warehouseLocationId
              );
              setValue(`products.${index}.batch_id`, stock.batchId);
              setValue(`products.${index}.quantity`, undefined as any);
            } else {
              setSelectedStockObj(null);
              setValue(`products.${index}.product_id`, undefined as any);
              setValue(
                `products.${index}.source_location_id`,
                undefined as any
              );
              setValue(`products.${index}.batch_id`, null);
              setValue(`products.${index}.quantity`, undefined as any);
            }
          }}
          onInputChange={(_, val, reason) => {
            if (reason === 'input' || reason === 'clear') setSearchTerm(val);
          }}
        />
        {errors.products?.[index]?.product_id && (
          <Typography variant='caption' color='error'>
            {errors.products[index]?.product_id?.message}
          </Typography>
        )}
      </TableCell>

      {/* 2. Cantidad (Igual, pero validado por lógica de negocio) */}
      <TableCell sx={{ verticalAlign: 'top', p: 1 }}>
        <Controller
          control={control}
          name={`products.${index}.quantity`}
          rules={{
            required: 'Requerido',
            validate: value => {
              const qty = Number(value);

              if (isNaN(qty) || qty <= 0) return 'Debe ser > 0';
              if (!sourceLocationId || !productId) return true;

              const allRows = getValues().products || [];
              const usedInOtherRows = allRows.reduce((acc, row, idx) => {
                if (idx === index) return acc;
                if (
                  row.product_id === productId &&
                  row.source_location_id === sourceLocationId &&
                  row.batch_id === batchId
                ) {
                  return acc + (Number(row.quantity) || 0);
                }

                return acc;
              }, 0);

              const total = usedInOtherRows + qty;

              if (total > currentStockLimit) {
                return `Max: ${Math.max(0, currentStockLimit - usedInOtherRows).toFixed(2)}`;
              }

              return true;
            }
          }}
          render={({
            field: { onChange, value, ref, onBlur },
            fieldState: { error }
          }) => {
            // ... (Lógica de inputs igual que antes) ...
            const allRows = getValues().products || [];
            const usedInOtherRows = allRows.reduce((acc, row, idx) => {
              if (idx === index) return acc;
              if (
                row.product_id === productId &&
                row.source_location_id === sourceLocationId &&
                row.batch_id === batchId
              ) {
                return acc + (Number(row.quantity) || 0);
              }

              return acc;
            }, 0);
            const maxAvailable = Math.max(
              0,
              currentStockLimit - usedInOtherRows
            );

            return (
              <TextField
                fullWidth
                inputRef={ref}
                value={value ?? ''}
                disabled={!productId}
                type='number'
                variant='standard'
                error={!!error}
                helperText={
                  error
                    ? error.message
                    : sourceLocationId
                      ? `Max: ${Number(currentStockLimit).toFixed(2)}`
                      : ''
                }
                InputProps={{
                  disableUnderline: true,
                  inputProps: { min: 0, max: maxAvailable, step: 0.0001 }
                }}
                sx={invisibleInputSx(!!error)}
                onChange={async e => {
                  // ... lógica igual ...
                  const val = e.target.value;

                  if (val.includes('.') && val.split('.')[1].length > 4) return;
                  const numValue = Number(val);

                  if (numValue > maxAvailable) {
                    onChange(maxAvailable);
                    await trigger(`products.${index}.quantity`);

                    return;
                  }
                  onChange(val === '' ? undefined : val);
                  await trigger(`products.${index}.quantity`);
                }}
                onBlur={async () => {
                  onBlur();
                  await trigger(`products.${index}.quantity`);
                }}
              />
            );
          }}
        />
      </TableCell>

      {/* 3. Ubicación Origen (Solo lectura) */}
      <TableCell sx={{ verticalAlign: 'top', p: 1 }}>
        <TextField
          disabled
          value={
            selectedStockObj?.warehouseLocation
              ? `${selectedStockObj.warehouseLocation.aisle}-${selectedStockObj.warehouseLocation.shelf}-${selectedStockObj.warehouseLocation.section}`
              : '---'
          }
          variant='standard'
          InputProps={{ disableUnderline: true }}
          sx={{ px: 1, borderRadius: 1, bgcolor: '#F1F5F9' }}
        />
      </TableCell>

      {/* 4. Ubicación Destino (Manejo de "Sin Ubicaciones") */}
      <TableCell sx={{ verticalAlign: 'top', p: 1 }}>
        <Controller
          control={control}
          name={`products.${index}.destination_location_id`}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Autocomplete
              options={destLocations}
              // Deshabilitar si no hay almacén destino, no hay producto, O el almacén no tiene ubicaciones
              disabled={
                !destWarehouseId || !productId || destLocations.length === 0
              }
              getOptionLabel={l => `${l.aisle}-${l.shelf}-${l.section}`}
              value={destLocations.find(l => l.id === value) || null}
              renderInput={params => (
                <TextField
                  {...params}
                  // Placeholder dinámico
                  placeholder={
                    !destWarehouseId
                      ? '---'
                      : destLocations.length === 0
                        ? 'Sin ubicaciones'
                        : 'Destino Sugerido'
                  }
                  variant='standard'
                  error={!!error}
                  helperText={error ? 'Requerido' : ''}
                  InputProps={{ ...params.InputProps, disableUnderline: true }}
                  sx={invisibleInputSx(!!error)}
                />
              )}
              onChange={(_, v) => onChange(v?.id)}
            />
          )}
        />
      </TableCell>

      <TableCell align='center' sx={{ verticalAlign: 'top', p: 1 }}>
        <Tooltip title='Eliminar fila'>
          <span>
            <IconButton
              size='small'
              disabled={isSingleRow}
              onClick={() => remove(index)}
            >
              <Trash2 size={18} />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
