import { useMemo, useEffect, FC, useState, memo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
import { Link, useNavigate } from '@tanstack/react-router';
import { Plus, Save, ArrowRightCircle, ArrowLeft, Trash2 } from 'lucide-react';
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  FormProvider,
  useFormContext
} from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { ErrorMapper } from '@/config/error.mapper';
import { FormHelper } from '@/config/helpers/form.helper';
import { cn } from '@/config/utils/cn.util';
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

interface CreateTransferContainerProps {}

export const CreateTransferContainer: FC<CreateTransferContainerProps> = () => {
  const navigate = useNavigate();
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

  const onSubmitTransfer = (data: InventoryTransferDto) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('Transferencia enviada exitosamente');
        navigate({ to: '/inventory-movements' });
      },
      onError: error => {
        const errors = ErrorMapper.mapErrorToApiResponse(error);

        toast.error(errors.message);

        FormHelper.setFormErrors(errors.errors, form.setError);
      }
    });
  };

  const onCancel = () => {
    navigate({ to: '/inventory-movements' });
  };

  return (
    <FormProvider {...form}>
      <Box className='flex flex-col gap-6'>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Link to='/inventory-movements'>
            <Button variant='outlined' startIcon={<ArrowLeft size={18} />}>
              Volver
            </Button>
          </Link>
          <Button
            disableElevation
            variant='contained'
            disabled={mutation.isPending || !form.formState.isValid}
            startIcon={<Save size={18} />}
            onClick={form.handleSubmit(onSubmitTransfer)}
          >
            {mutation.isPending ? 'Procesando...' : 'Enviar Transferencia'}
          </Button>
        </Box>

        <Card>
          <CardContent>
            <Typography gutterBottom variant='h6' fontWeight={600}>
              Selección de Almacenes
            </Typography>
            <Grid container spacing={3} alignItems='center' sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Controller
                  name='source_warehouse_id'
                  control={form.control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      {...field}
                      options={sortedWarehouses}
                      getOptionLabel={w => w.name}
                      value={warehouses.find(w => w.id === field.value) || null}
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
              <Grid
                size={{ xs: 12, md: 2 }}
                display='flex'
                justifyContent='center'
              >
                <ArrowRightCircle
                  className='text-slate-400'
                  size={32}
                  strokeWidth={1.5}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
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
                      value={warehouses.find(w => w.id === field.value) || null}
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
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              mb={2}
            >
              <Typography variant='h6' fontWeight={600}>
                Detalle de Productos
              </Typography>
              <Button
                size='small'
                disabled={!sourceWarehouseId}
                startIcon={<Plus size={16} />}
                variant='outlined'
                sx={{ textTransform: 'none', fontWeight: 600 }}
                onClick={onCreateNewProduct}
              >
                Agregar Fila
              </Button>
            </Box>

            <TableContainer
              component={Paper}
              variant='outlined'
              sx={{ borderRadius: 2, maxHeight: '60vh' }}
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
                      <OptimizedTransferRow
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
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <TextField
              {...form.register('notes')}
              multiline
              fullWidth
              label='Observaciones Generales'
              rows={3}
              placeholder='Escribe aquí cualquier detalle adicional...'
              variant='outlined'
              size='small'
            />
          </CardContent>
        </Card>

        <Box display='flex' justifyContent='flex-end' gap={2}>
          <Button variant='outlined' onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            disableElevation
            variant='contained'
            disabled={mutation.isPending || !form.formState.isValid}
            startIcon={<Save size={18} />}
            onClick={form.handleSubmit(onSubmitTransfer)}
          >
            {mutation.isPending ? 'Procesando...' : 'Enviar Transferencia'}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

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
        'product.productType',
        'product.measureUnit'
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

  const remoteStocks = useMemo(
    () =>
      (stocksData?.data || []).filter(s => {
        const status = s.status?.toLowerCase() || '';
        const qty = Number(s.quantity) || 0;

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
      <TableCell sx={{ verticalAlign: 'top', p: 1 }}>
        <Autocomplete
          options={options}
          groupBy={option =>
            option.product?.productType?.name || 'Sin Categoría'
          }
          getOptionLabel={s => {
            if (!s.product) return '';
            const batchInfo = s.batch ? ` | Lote: ${s.batch.code}` : '';
            const uom = s.product?.measureUnit?.code || 'U';

            return `${s.product.sku} - ${s.product.name}${batchInfo} (${uom})`;
          }}
          renderOption={(props, option) => (
            <li
              {...props}
              className={cn(
                props.className,
                ' !px-2 !py-1 border-b border-slate-100'
              )}
            >
              <div className='w-full flex justify-between items-start gap-1'>
                <div className='flex flex-col overflow-hidden'>
                  <span className='text-xs font-semibold text-slate-800 truncate leading-tight'>
                    {option.product?.name}
                  </span>
                  <div className='flex items-center gap-1 mt-0.5 text-[10px] text-slate-500 leading-none'>
                    <span>SKU: {option.product?.sku}</span>
                    {option.warehouseLocation && (
                      <>
                        <span className='text-slate-300'>•</span>
                        <span className='flex items-center gap-0.5'>
                          📍{' '}
                          {`${option.warehouseLocation.aisle}-${option.warehouseLocation.shelf}-${option.warehouseLocation.section}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className='flex flex-col items-end gap-0.5 shrink-0'>
                  <span className='text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100 leading-none'>
                    {Number(option.quantity).toFixed(2)}{' '}
                    {option.product?.measureUnit?.code}
                  </span>
                  {option.batch && (
                    <span className='text-[9px] font-medium text-blue-700 bg-blue-50 px-1 py-0.5 rounded border border-blue-100 leading-none'>
                      Lote: {option.batch.code}
                    </span>
                  )}
                </div>
              </div>
            </li>
          )}
          loading={isLoadingStocks}
          value={selectedStockObj || null}
          isOptionEqualToValue={(option, value) => option.id === value.id}
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
            />
          )}
          filterOptions={x => x}
          onChange={(_, stock) => {
            if (stock) {
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
            const allRows = getValues().products || [];

            const usedInOtherRows = allRows.reduce((acc, row, idx) => {
              if (idx === index) return acc;
              if (
                row.product_id === productId &&
                row.source_location_id === sourceLocationId &&
                row.batch_id === batchId
              )
                return acc + (Number(row.quantity) || 0);

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
                      ? `Max: ${Number(maxAvailable).toFixed(2)} ${selectedStockObj?.product?.measureUnit?.code || ''}`
                      : ''
                }
                InputProps={{
                  disableUnderline: true,
                  inputProps: { min: 0, max: maxAvailable, step: 0.0001 },
                  endAdornment: selectedStockObj?.product?.measureUnit?.code ? (
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{ ml: 1 }}
                    >
                      {selectedStockObj.product.measureUnit.code}
                    </Typography>
                  ) : null
                }}
                onChange={async e => {
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

      <TableCell sx={{ verticalAlign: 'top', p: 1 }}>
        <Controller
          control={control}
          name={`products.${index}.destination_location_id`}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Autocomplete
              options={destLocations}
              disabled={
                !destWarehouseId || !productId || destLocations.length === 0
              }
              getOptionLabel={l => `${l.aisle}-${l.shelf}-${l.section}`}
              value={destLocations.find(l => l.id === value) || null}
              renderInput={params => (
                <TextField
                  {...params}
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

const OptimizedTransferRow = memo(
  TransferRow,
  (prev, next) =>
    prev.sourceWarehouseId === next.sourceWarehouseId &&
    prev.destWarehouseId === next.destWarehouseId
);
