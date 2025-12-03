import type { FC } from 'react';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip, { ChipProps } from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';
import {
  ArrowDown,
  ArrowDownCircle,
  ArrowRightCircle,
  ArrowUp,
  ArrowUpCircle,
  FileText,
  Plus,
  UserIcon
} from 'lucide-react';
import { MRT_ColumnDef } from 'material-react-table';

import { InventoryMovementHelper } from '../../inventory-movement.helper';
import {
  InventoryMovement,
  MovementType
} from '../../inventory-movement.interface';

import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { CreateTransferDrawer } from '@/features/inventory-movements/components/movement-table/create-transfer-drawer/CreateTransferDrawer';
import { useInventoryMovementsQuery } from '@/features/inventory-movements/hooks/inventory-movements.query';
import { InventoryMovementParams } from '@/features/inventory-movements/inventory-movement.interface';
import { useWarehousesQuery } from '@/features/warehouses/hooks/warehouses.query';

interface MovementsTableProps {}

const isEntryType = (type: MovementType): boolean => {
  return type === MovementType.Entry;
};

export const MovementsTable: FC<MovementsTableProps> = ({}) => {
  const { permissions } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const [selectedWarehouse, setSelectedWarehouse] = useState<number | ''>('');
  const [selectedType, setSelectedType] = useState<string | ''>('');

  const { data: warehousesData } = useWarehousesQuery({
    options: {}
  });
  const warehouses = useMemo(
    () =>
      warehousesData?.data.sort(
        (a, b) => (b?.stocksCount || 0) - (a?.stocksCount || 0)
      ) || [],
    [warehousesData]
  );

  const movementParams: InventoryMovementParams = {
    include: [
      'product',
      'product.measureUnit',
      'warehouse',
      'warehouseLocation',
      'batch',
      'user',
      'relatedMovement',
      'relatedMovement.warehouse'
    ],
    filter: {
      ...(selectedWarehouse && { warehouse_id: selectedWarehouse }),
      ...(selectedType && { type: selectedType as any })
    }
  };

  const memoizedColumns = useMemo<MRT_ColumnDef<InventoryMovement>[]>(
    () => [
      {
        header: 'Cuándo',
        id: 'created_at',
        accessorKey: 'createdAt',
        size: 100,
        filterVariant: 'date-range',
        Cell: ({ row: { original } }) => (
          <div className='flex flex-col'>
            <span className='text-sm font-semibold text-gray-900'>
              {dayjs(original.createdAt).format('DD MMM, YYYY')}
            </span>
            <span className='text-xs text-gray-500'>
              {dayjs(original.createdAt).format('HH:mm a')}
            </span>
          </div>
        )
      },

      {
        header: 'Movimiento',
        id: 'type',
        accessorKey: 'type',
        size: 130,
        filterVariant: 'select',
        filterOptions: [
          { label: 'Entrada', value: MovementType.Entry },
          { label: 'Salida', value: MovementType.Exit }
        ],
        Cell: ({ row: { original } }) => {
          const isEntry = isEntryType(original.type);
          const isTransfer = !!original.relatedMovement;

          let color: ChipProps['color'] = isEntry ? 'success' : 'error';
          let Icon = isEntry ? ArrowUpCircle : ArrowDownCircle;
          let label = InventoryMovementHelper.humanReadableType(original.type);

          if (isTransfer) {
            color = 'info';
            Icon = ArrowRightCircle;
            label = isEntry ? 'Recepción Transf.' : 'Envío Transf.';
          }

          return (
            <Chip
              icon={<Icon size={16} />}
              label={label}
              size='small'
              color={color}
              variant='outlined'
              sx={{ fontWeight: 600, border: 'none', bgcolor: `${color}.50` }}
            />
          );
        }
      },

      {
        header: 'Producto',
        id: 'product.name',
        accessorKey: 'product.name',
        size: 280,
        Cell: ({ row: { original } }) => (
          <div className='flex flex-col'>
            <span className='text-sm font-bold leading-tight text-gray-800'>
              {original.product?.name}
            </span>
            <span className='font-mono text-xs text-gray-500'>
              SKU: {original.product?.sku}
            </span>
          </div>
        )
      },

      {
        header: 'Origen',
        id: 'sourceWarehouse.name',
        enableColumnFilter: false,
        accessorFn: row => {
          if (row.type === MovementType.Entry && row.relatedMovement?.warehouse)
            return row.relatedMovement.warehouse.name;
          if (row.type === MovementType.Exit && row.warehouse)
            return row.warehouse.name;

          return '-';
        },
        size: 150
      },

      {
        header: 'Destino',
        id: 'destinationWarehouse.name',
        enableColumnFilter: false,
        accessorFn: row => {
          if (row.type === MovementType.Exit && row.relatedMovement?.warehouse)
            return row.relatedMovement.warehouse.name;

          if (row.type === MovementType.Entry && row.warehouse)
            return row.warehouse.name;

          return '-';
        },
        size: 150
      },

      {
        header: 'Referencia',
        id: 'reference_id',
        size: 160,
        enableColumnFilter: false,
        Cell: ({ row: { original } }) => {
          let text = 'Ajuste Manual';
          let subtext = '';

          if (original.referenceId) {
            if (original.type === MovementType.Entry) {
              text = `Orden Compra #${original.referenceId}`;
            } else {
              text = `Pedido #${original.referenceId}`;
            }
          } else if (original.relatedMovement) {
            text = 'Transferencia';
            subtext =
              original.type === MovementType.Exit
                ? `Hacia: ${original.relatedMovement.warehouse?.name}`
                : `Desde: ${original.relatedMovement.warehouse?.name}`;
          }

          return (
            <div className='flex items-center gap-2'>
              <FileText size={16} className='text-gray-400' />
              <div className='flex flex-col'>
                <span className='text-sm text-gray-700'>{text}</span>
                {subtext && (
                  <span className='text-xs text-gray-500'>{subtext}</span>
                )}
              </div>
            </div>
          );
        }
      },

      {
        header: 'Cantidad',
        id: 'quantity',
        accessorKey: 'quantity',
        size: 110,
        filterVariant: 'range-slider',
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ row: { original } }) => {
          const val = Number(original.quantity);
          const isPositive = val > 0;

          return (
            <div className='flex items-baseline justify-end gap-1'>
              <span
                className={`text-sm font-bold tabular-nums ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? '+' : ''}
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
        header: 'Stock',
        id: 'balance_after',
        accessorKey: 'balanceAfter',
        size: 100,
        filterVariant: 'range-slider',
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ row: { original } }) => (
          <div className='flex items-baseline justify-end gap-1'>
            <span className='text-sm font-medium tabular-nums text-gray-900'>
              {Number(original.balanceAfter).toFixed(2)}
            </span>
            <span className='text-xs text-gray-500'>
              {original.product?.measureUnit?.code}
            </span>
          </div>
        )
      },

      {
        header: 'Usuario',
        id: 'user.fullName',
        accessorFn: row => row.user?.fullName,
        size: 150,
        Cell: ({ row: { original } }) => (
          <div className='flex items-center gap-2'>
            <UserIcon size={16} className='text-gray-400 opacity-50' />
            <span className='max-w-[140px] truncate text-sm text-gray-600'>
              {original.user?.fullName || 'Sistema'}
            </span>
          </div>
        )
      }
    ],
    []
  );

  return (
    <>
      <CustomTable
        queryHook={useInventoryMovementsQuery}
        queryProps={{
          options: movementParams
        }}
        columns={memoizedColumns}
        enableRowActions={false}
        initialState={{
          sorting: [{ id: 'created_at', desc: true }],
          columnVisibility: { id: false }
        }}
        renderTopToolbarCustomActions={() => (
          <Box
            display='flex'
            gap={2}
            alignItems='flex-end'
            flexWrap='wrap'
            sx={{ width: '100%' }}
          >
            <FormControl
              size='small'
              sx={{ minWidth: 200, width: { xs: '100%', md: 'auto' } }}
            >
              <InputLabel>Almacén</InputLabel>
              <Select
                displayEmpty
                value={selectedWarehouse}
                label='Almacén'
                onChange={e =>
                  setSelectedWarehouse(e.target.value as number | '')
                }
              >
                <MenuItem value=''>
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
              sx={{ minWidth: 220, width: { xs: '100%', md: 'auto' } }}
            >
              <InputLabel>Tipo de movimiento</InputLabel>
              <Select
                displayEmpty
                value={selectedType}
                label='Tipo de movimiento'
                onChange={e => setSelectedType(e.target.value)}
              >
                <MenuItem value=''>
                  <em>Todos los tipos</em>
                </MenuItem>
                <MenuItem value='entry'>
                  <div className='flex items-center gap-2'>
                    <ArrowUp size={16} className='text-green-600' /> Entrada
                  </div>
                </MenuItem>
                <MenuItem value='exit'>
                  <div className='flex items-center gap-2'>
                    <ArrowDown size={16} className='text-red-600' /> Salida
                  </div>
                </MenuItem>
              </Select>
            </FormControl>

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
                  onClick={() => setIsOpen(true)}
                >
                  Transferencia
                </Button>
              )}

              {permissions.includes('inventory-movements.create-entry') && (
                <Button
                  variant='contained'
                  color='success'
                  size='small'
                  sx={{ height: 40, flex: { xs: 1, md: 'initial' } }}
                  startIcon={<ArrowUp size={16} />}
                >
                  Nueva Entrada
                </Button>
              )}

              {permissions.includes('inventory-movements.create-exit') && (
                <Button
                  variant='contained'
                  color='error'
                  size='small'
                  sx={{ height: 40, flex: { xs: 1, md: 'initial' } }}
                  startIcon={<ArrowDown size={16} />}
                >
                  Nueva Salida
                </Button>
              )}
            </Box>
          </Box>
        )}
      />

      {isOpen && (
        <CreateTransferDrawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
