import type { ColumnFiltersState } from '@tanstack/react-table';
import type { FC } from 'react';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Download, Plus } from 'lucide-react';
import { MRT_ColumnDef } from 'material-react-table';

import { useInventoryStocksQuery } from '../../hooks/inventory-stocks.query';
import { InventoryStockHelper } from '../../inventory-stock.helper';
import {
  InventoryStockStatus,
  InventoryStock,
  InventoryStockParams
} from '../../inventory-stock.interface';

import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { CreateTransferDrawer } from '@/features/inventory-movements/components/movement-table/create-transfer-drawer/CreateTransferDrawer';
import { useProductTypesQuery } from '@/features/product-types/hooks/product-types.query';
import { useWarehousesQuery } from '@/features/warehouses/hooks/warehouses.query';
import { CustomOption } from '@/interfaces/custom-option.interface';

interface InventoryStocksTableProps {}

const statusColors: Record<
  InventoryStockStatus,
  'success' | 'error' | 'warning' | 'info' | 'default'
> = {
  [InventoryStockStatus.Available]: 'success',
  [InventoryStockStatus.Reserved]: 'warning',
  [InventoryStockStatus.Damaged]: 'error'
};

export const InventoryStocksTable: FC<InventoryStocksTableProps> = ({}) => {
  const { permissions } = useAuth();

  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
    null
  );
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<
    number | null
  >(null);
  const [selectedStatus, setSelectedStatus] =
    useState<InventoryStockStatus | null>(null);

  const { data: warehousesData } = useWarehousesQuery({});

  const { data: productTypesData } = useProductTypesQuery({});

  const warehouses = useMemo(
    () =>
      (warehousesData?.data || []).sort(
        (a, b) => (b?.stocksCount || 0) - (a?.stocksCount || 0)
      ),
    [warehousesData]
  );
  const warehouseOptions = useMemo<CustomOption[]>(
    () =>
      warehouses.map(warehouse => ({
        label: warehouse.name,
        value: warehouse.id
      })),
    [warehouses]
  );

  const productTypes = useMemo(
    () => productTypesData?.data || [],
    [productTypesData]
  );
  const productTypeOptions = useMemo<CustomOption[]>(
    () =>
      productTypes.map(productType => ({
        label: productType.name,
        value: productType.id
      })),
    [productTypes]
  );

  const stockParams: InventoryStockParams = {
    include: [
      'product',
      'product.measureUnit',
      'product.productType',
      'warehouse',
      'warehouseLocation',
      'batch'
    ]
  };

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];

    if (selectedWarehouseId) {
      filters.push({
        id: 'warehouse_id',
        value: selectedWarehouseId
      });
    }

    if (selectedProductTypeId) {
      filters.push({
        id: 'product.product_type_id',
        value: selectedProductTypeId
      });
    }

    if (selectedStatus) {
      filters.push({
        id: 'status',
        value: selectedStatus
      });
    }

    return filters;
  }, [selectedWarehouseId, selectedProductTypeId, selectedStatus]);

  const onClearFilters = () => {
    setSelectedWarehouseId(null);
    setSelectedProductTypeId(null);
    setSelectedStatus(null);
  };

  const hasActiveFilters = useMemo(
    () =>
      Boolean(selectedWarehouseId) ||
      Boolean(selectedProductTypeId) ||
      Boolean(selectedStatus),
    [selectedWarehouseId, selectedProductTypeId, selectedStatus]
  );

  const onExport = () => {};

  const columns = useMemo<MRT_ColumnDef<InventoryStock>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessorKey: 'id',
        size: 60
      },
      {
        header: 'SKU',
        id: 'product.sku',
        accessorFn: row => row.product?.sku || '-',
        size: 120
      },
      {
        header: 'Producto',
        id: 'product.name',
        accessorFn: row => row.product?.name || '-',
        size: 200
      },
      {
        header: 'Tipo',
        id: 'product.product_type_id',
        accessorFn: row => row.product?.productType?.name || '-',
        size: 180,
        filterVariant: 'select',
        filterSelectOptions: productTypeOptions
      },
      {
        header: 'Almacén',
        id: 'warehouse_id',
        accessorFn: row => (row.warehouse ? row.warehouse.name : '-'),
        size: 150,
        filterVariant: 'select',
        filterSelectOptions: warehouseOptions
      },
      {
        header: 'Ubicación',
        id: 'warehouseLocation.search',
        accessorFn: row =>
          row.warehouseLocation
            ? row.warehouseLocation.aisle +
              ' - ' +
              row.warehouseLocation.shelf +
              ' - ' +
              row.warehouseLocation.section
            : '-',
        size: 150
      },
      {
        header: 'Cantidad Actual',
        id: 'quantity',
        accessorKey: 'quantity',
        size: 100,
        Cell: ({ row: { original } }) => {
          const val = Number(original.quantity);

          return (
            <div>
              <span className={`text-sm font-bold tabular-nums`}>
                {' '}
                {val.toFixed(2)}
              </span>
              <span className='text-xs text-gray-500'>
                {original.product?.measureUnit?.code}
              </span>
            </div>
          );
        }
      },
      {
        header: 'Estado',
        id: 'status',
        accessorKey: 'status',
        size: 120,
        filterVariant: 'select',
        filterSelectOptions: InventoryStockHelper.getHumanStatuses(),
        Cell: ({ row: { original } }) => (
          <Chip
            label={InventoryStockHelper.humanReadableStatus(original.status)}
            color={statusColors[original.status]}
            size='small'
          />
        )
      }
    ],
    [productTypeOptions, warehouseOptions]
  );

  return (
    <>
      <CustomTable
        queryHook={useInventoryStocksQuery}
        queryProps={{ options: stockParams }}
        columns={columns}
        enableRowActions={false}
        customFilters={columnFilters}
        initialState={{
          columnVisibility: { id: false }
        }}
        renderTopToolbarCustomActions={() => (
          <Box display='flex' gap={2} alignItems='flex-end' flexWrap='wrap'>
            <FormControl
              size='small'
              sx={{ minWidth: 200, width: { xs: '100%', md: 'auto' } }}
            >
              <InputLabel>Almacén</InputLabel>
              <Select
                displayEmpty
                value={selectedWarehouseId ?? 'all'}
                label='Almacén'
                onChange={e =>
                  setSelectedWarehouseId(
                    !isNaN(Number(e.target.value))
                      ? Number(e.target.value)
                      : null
                  )
                }
              >
                <MenuItem value='all'>
                  <em>Todos los almacenes</em>
                </MenuItem>
                {warehouses.map(warehouse => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size='small'
              sx={{ minWidth: 200, width: { xs: '100%', md: 'auto' } }}
            >
              <InputLabel>Tipo de Producto</InputLabel>
              <Select
                displayEmpty
                value={selectedProductTypeId ?? 'all'}
                label='Tipo de Producto'
                onChange={e =>
                  setSelectedProductTypeId(
                    !isNaN(Number(e.target.value))
                      ? Number(e.target.value)
                      : null
                  )
                }
              >
                <MenuItem value='all'>
                  <em>Todos los tipos</em>
                </MenuItem>
                {productTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {hasActiveFilters && (
              <Button
                variant='outlined'
                size='small'
                sx={{ height: 40, width: { xs: '100%', md: 'auto' } }}
                onClick={onClearFilters}
              >
                Limpiar filtros
              </Button>
            )}

            <Box
              display='flex'
              gap={1}
              sx={{
                width: { xs: '100%', md: 'auto' },
                flexWrap: { xs: 'wrap', md: 'nowrap' }
              }}
            >
              {permissions.includes('inventory-movements.create-transfer') && (
                <Button
                  variant='outlined'
                  color='primary'
                  size='small'
                  sx={{ height: 40, flex: { xs: 1, md: 'initial' } }}
                  startIcon={<Plus size={16} />}
                  onClick={() => setIsOpenTransfer(true)}
                >
                  Transferencia
                </Button>
              )}
            </Box>

            <Box
              display='flex'
              gap={1}
              sx={{
                width: { xs: '100%', md: 'auto' },
                marginLeft: { xs: 0, md: 'auto' }
              }}
            >
              <Button
                variant='outlined'
                color='primary'
                size='small'
                sx={{ height: 40, flex: { xs: 1, md: 'initial' } }}
                startIcon={<Download size={16} />}
                onClick={onExport}
              >
                Exportar Reporte
              </Button>
            </Box>
          </Box>
        )}
      />

      {isOpenTransfer && (
        <CreateTransferDrawer
          isOpen={isOpenTransfer}
          onClose={() => setIsOpenTransfer(false)}
        />
      )}
    </>
  );
};
