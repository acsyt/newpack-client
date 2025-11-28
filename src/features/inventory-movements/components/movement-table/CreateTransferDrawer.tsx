import { useState, useMemo, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import { useDebounce } from 'use-debounce';

import { useCreateTransferMutation } from '../../hooks/inventory-movements.query';
import {
  InventoryTransferDto,
  inventoryTransferSchema
} from '../../inventory-movement.schema';
import { useInventoryMovementDrawerStore } from '../../store/useInventoryMovementDrawerStore';

import { CustomDrawer } from '@/components/shared/CustomDrawer';
import { ErrorMapper } from '@/config/error.mapper';
import { FormHelper } from '@/config/helpers/form.helper';
import { useInventoryStocksQuery } from '@/features/inventory-stocks/hooks/inventory-stocks.query';
import { InventoryStockParams } from '@/features/inventory-stocks/inventory-stock.interface';
import {
  useWarehouseLocationsQuery,
  useWarehousesQuery
} from '@/features/warehouses/hooks/warehouses.query';
import { WarehouseLocation } from '@/features/warehouses/warehouse.interface';

const invisibleInputSx = (error: boolean) => ({
  bgcolor: error ? '#FEF2F2' : 'transparent',
  borderRadius: 1,
  px: 1,
  transition: 'all 0.2s',
  '&:hover': { bgcolor: '#F8FAFC', boxShadow: '0 0 0 1px #E2E8F0 inset' },
  '&.Mui-focused': { bgcolor: 'white', boxShadow: '0 0 0 1px #3B82F6 inset' }
});

export const CreateTransferDrawer = () => {
  const { isOpen, onClose } = useInventoryMovementDrawerStore();
  const mutation = useCreateTransferMutation();

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

  const onCreateNewProduct = () => {
    append({
      product_id: undefined as any,
      quantity: undefined as any,
      source_location_id: undefined as any,
      destination_location_id: undefined as any,
      batch_id: null
    });
  };

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
  const warehouses = warehousesData?.data || [];

  const { data: destLocationsData } = useWarehouseLocationsQuery({
    options: {
      has_pagination: false,
      filter: { warehouse_id: destWarehouseId ? [destWarehouseId] : [] }
    },
    enabled: !!destWarehouseId
  });
  const destLocations = destLocationsData?.data || [];

  const handleSubmit = (data: InventoryTransferDto) => {
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
      title='Nueva Transferencia'
      width='1100px'
      footer={
        <Box display='flex' justifyContent='flex-end' width='100%' gap={2}>
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
            {mutation.isPending ? 'Procesando...' : 'Confirmar Transferencia'}
          </Button>
        </Box>
      }
      onClose={onClose}
    >
      <FormProvider {...form}>
        <Box className='flex flex-col gap-6'>
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
                      value={warehouses.find(w => w.id === field.value) || null}
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
                      value={warehouses.find(w => w.id === field.value) || null}
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
            placeholder='Escribe aquí cualquier detalle adicional sobre la transferencia...'
            variant='outlined'
            size='small'
          />
        </Box>
      </FormProvider>
    </CustomDrawer>
  );
};

const TransferRow = ({
  index,
  remove,
  destLocations,
  sourceWarehouseId,
  destWarehouseId,
  isSingleRow
}: {
  index: number;
  remove: (index: number) => void;
  destLocations: WarehouseLocation[];
  sourceWarehouseId?: number;
  destWarehouseId?: number;
  isSingleRow: boolean;
}) => {
  const {
    control,
    setValue,
    getValues,
    formState: { isSubmitted, errors }
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
        warehouse_id: sourceWarehouseId,
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

  const remoteStocks = useMemo(
    () =>
      (stocksData?.data || []).filter(s => {
        const status = s.status?.toLowerCase() || '';

        return status === 'available';
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
            const batchInfo = s.batch
              ? ` | Lote: ${s.batch.code} (Vence: ${s.batch.expirationDate ?? 'N/A'})`
              : '';

            return `${s.product.sku} - ${s.product.name}${batchInfo} (Disp: ${Number(s.quantity).toFixed(2)})`;
          }}
          loading={isLoadingStocks}
          value={selectedStockObj || null}
          isOptionEqualToValue={(option, value) => option.id === value.id}
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
            if (stock) {
              // VALIDACIÓN: DETECCIÓN DE DUPLICADOS
              const currentProducts = getValues().products;
              const isDuplicate = currentProducts.some(
                (p, idx) =>
                  idx !== index && // No compararse con uno mismo
                  p.product_id === stock.productId &&
                  p.source_location_id === stock.warehouseLocationId &&
                  p.batch_id === stock.batchId
              );

              if (isDuplicate) {
                alert(
                  'Este producto con este lote y ubicación ya está agregado en otra fila.'
                );
                setSelectedStockObj(null);

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
            if (reason === 'input' || reason === 'clear') {
              setSearchTerm(val);
            }
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

              if (qty <= 0) return 'Debe ser mayor a 0';

              if (!sourceLocationId || !productId) return true;

              // Calcular uso total en TODO el formulario para este lote
              const allRows = getValues().products || [];
              const totalUsed = allRows.reduce((acc, row, _) => {
                // Sumar si es el mismo producto/lote/ubicación
                if (
                  row.product_id === productId &&
                  row.source_location_id === sourceLocationId &&
                  row.batch_id === batchId
                ) {
                  return acc + (Number(row.quantity) || 0);
                }

                return acc;
              }, 0);

              if (totalUsed > currentStockLimit) {
                const othersUsed = totalUsed - qty;
                const remaining = currentStockLimit - othersUsed;

                return `Max disponible: ${Math.max(0, remaining).toFixed(2)}`;
              }

              return true;
            }
          }}
          render={({
            field: { onChange, value, ref, onBlur },
            fieldState: { error, isTouched, isDirty }
          }) => (
            <TextField
              fullWidth
              inputRef={ref}
              value={value ?? ''}
              disabled={!productId}
              type='number'
              variant='standard'
              error={!!error && (isTouched || isDirty || isSubmitted)}
              helperText={
                error && (isTouched || isDirty || isSubmitted)
                  ? error.message
                  : sourceLocationId
                    ? `Max: ${Number(currentStockLimit).toFixed(2)}`
                    : ''
              }
              InputProps={{ disableUnderline: true }}
              sx={invisibleInputSx(
                !!error && (isTouched || isDirty || isSubmitted)
              )}
              onKeyDown={e => {
                if (['e', 'E', '+', '-'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={e => {
                const val = e.target.value;

                if (val.includes('.') && val.split('.')[1].length > 4) return;
                onChange(val === '' ? undefined : val);
              }}
              onBlur={onBlur}
            />
          )}
        />
      </TableCell>

      <TableCell sx={{ verticalAlign: 'top', p: 1 }}>
        <TextField
          disabled
          value={
            selectedStockObj?.warehouseLocation
              ? `${selectedStockObj.warehouseLocation.aisle}-${selectedStockObj.warehouseLocation.shelf}`
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
              disabled={!destWarehouseId || !productId}
              getOptionLabel={l => `${l.aisle}-${l.shelf}-${l.section}`}
              value={destLocations.find(l => l.id === value) || null}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder='---'
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
