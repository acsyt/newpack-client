import { FC, useState, useMemo, useEffect } from 'react';

import {
  TableRow,
  TableCell,
  Autocomplete,
  TextField,
  Typography,
  Tooltip,
  IconButton
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { invisibleInputSx } from './CreateTransferDrawer';

import { cn } from '@/config/utils/cn.util';
import { InventoryTransferDto } from '@/features/inventory-movements/inventory-movement.schema';
import { useInventoryStocksQuery } from '@/features/inventory-stocks/hooks/inventory-stocks.query';
import { InventoryStockParams } from '@/features/inventory-stocks/inventory-stock.interface';
import { WarehouseLocation } from '@/features/warehouses/warehouse.interface';

interface TransferRowProps {
  index: number;
  remove: (index: number) => void;
  destLocations: WarehouseLocation[];
  sourceWarehouseId?: number;
  destWarehouseId?: number;
  isSingleRow: boolean;
}

export const TransferRow: FC<TransferRowProps> = ({
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

  const allProductsWatcher = useWatch({ control, name: 'products' });

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
                ' !px-3 !py-2 border-b border-slate-100'
              )}
            >
              <div className='w-full flex justify-between items-start gap-2'>
                <div className='flex flex-col overflow-hidden'>
                  <span className='text-sm font-semibold text-slate-800 truncate'>
                    {option.product?.name}
                  </span>
                  <div className='flex items-center gap-2 mt-0.5 text-xs text-slate-500'>
                    <span>SKU: {option.product?.sku}</span>
                    {option.warehouseLocation && (
                      <>
                        <span className='text-slate-300'>•</span>
                        <span className='flex items-center gap-1'>
                          📍{' '}
                          {`${option.warehouseLocation.aisle}-${option.warehouseLocation.shelf}-${option.warehouseLocation.section}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className='flex flex-col items-end gap-1 shrink-0'>
                  <span className='text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100'>
                    {Number(option.quantity).toFixed(2)}{' '}
                    {option.product?.measureUnit?.code}
                  </span>
                  {option.batch && (
                    <span className='text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100'>
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
              sx={invisibleInputSx(false)}
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
            const allRows = allProductsWatcher || [];
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
                sx={invisibleInputSx(!!error)}
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
