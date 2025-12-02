import type { FC } from 'react';

import { useMemo, useState } from 'react';

import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import { MRT_ColumnDef } from 'material-react-table';

import { InventoryMovementHelper } from '../../inventory-movement.helper';
import {
  InventoryMovement,
  MovementType
} from '../../inventory-movement.interface';

import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { CreateTransferDrawer } from '@/features/inventory-movements/components/movement-table/CreateTransferDrawer';
import { TransfersTab } from '@/features/inventory-movements/components/movement-table/TransfersTab';
import { useInventoryMovementsQuery } from '@/features/inventory-movements/hooks/inventory-movements.query';
import { InventoryMovementParams } from '@/features/inventory-movements/inventory-movement.interface';
import { useWarehousesQuery } from '@/features/warehouses/hooks/warehouses.query';

interface MovementsTableProps {}

const typeColors: Record<
  MovementType,
  'success' | 'error' | 'warning' | 'info' | 'default'
> = {
  [MovementType.Entry]: 'success',
  [MovementType.Exit]: 'success'
};

const typeLabels: Record<MovementType, string> = {
  [MovementType.Entry]: 'Entrada',
  [MovementType.Exit]: 'Salida'
};

const isEntryType = (type: MovementType): boolean => {
  return type === MovementType.Entry;
};

export const MovementsTable: FC<MovementsTableProps> = ({}) => {
  const { permissions } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);

  const memoizedColumns = useMemo<MRT_ColumnDef<InventoryMovement>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessorKey: 'id',
        size: 60
      },
      {
        header: 'Fecha/Hora',
        id: 'created_at',
        accessorKey: 'createdAt',
        filterVariant: 'date-range',
        size: 160,
        accessorFn: row =>
          row.createdAt
            ? dayjs(row.createdAt)
                .tz(dayjs.tz.guess())
                .format('DD/MM/YYYY HH:mm')
            : '-'
      },
      {
        header: 'Tipo',
        id: 'type',
        accessorKey: 'type',
        size: 180,
        filterVariant: 'select',
        filterSelectOptions: InventoryMovementHelper.getHumanTypes(),
        Cell: ({ row: { original } }) => (
          <Chip
            label={InventoryMovementHelper.humanReadableType(original.type)}
            color={typeColors[original.type]}
            size='small'
            icon={
              isEntryType(original.type) ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )
            }
          />
        )
      },
      {
        header: 'SKU',
        id: 'sku',
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
        header: 'Almacén',
        id: 'warehouse.name',
        accessorFn: row => (row.warehouse ? row.warehouse.name : '-'),
        size: 150
      },
      {
        header: 'Orden de Compra',
        id: 'purchase_order',
        accessorFn: row => {
          if (row.type === MovementType.Entry && row.referenceId) {
            return `#${row.referenceId}`;
          }

          return '-';
        },
        size: 160,
        Cell: ({ row: { original } }) => {
          if (original.type === MovementType.Entry && original.referenceId) {
            return (
              <span style={{ fontWeight: 500 }}>#{original.referenceId}</span>
            );
          }

          return '-';
        }
      },
      {
        header: 'Pedido Interno',
        id: 'internal_order',
        accessorFn: row => {
          if (row.type === MovementType.Exit && row.referenceId)
            return `#${row.referenceId}`;

          return '-';
        },
        size: 160,
        Cell: ({ row: { original } }) => {
          if (original.type === MovementType.Exit && original.referenceId) {
            return (
              <span style={{ fontWeight: 500 }}>#{original.referenceId}</span>
            );
          }

          return '-';
        }
      },
      {
        header: 'Origen',
        id: 'source_warehouse',
        accessorFn: row => {
          if (
            row.type === MovementType.Exit &&
            row.relatedMovement?.warehouse
          ) {
            return row.relatedMovement.warehouse.name;
          }

          return '-';
        },
        size: 150
      },
      {
        header: 'Destino',
        id: 'destination_warehouse',
        accessorFn: row =>
          row.type === MovementType.Exit && row.warehouse
            ? row.warehouse.name
            : '-',
        size: 150
      },
      {
        header: 'Cantidad',
        id: 'quantity',
        accessorKey: 'quantity',
        size: 100,
        Cell: ({ row: { original } }) => {
          const quantity = Number(original.quantity);
          const isEntry = isEntryType(original.type);

          return (
            <span
              style={{
                fontWeight: 'bold',
                color: isEntry ? 'green' : 'red'
              }}
            >
              {isEntry ? '+' : '-'}
              {Math.abs(quantity).toFixed(2)}{' '}
              {original.product?.measureUnit?.code || ''}
            </span>
          );
        }
      },
      {
        header: 'Saldo Resultante',
        id: 'balance_after',
        size: 140,
        Cell: ({ row: { original } }) => {
          const balance = Number(original.balanceAfter);

          return (
            <span style={{ fontWeight: 'bold' }}>
              {balance.toFixed(2)} {original.product?.measureUnit?.code || ''}
            </span>
          );
        }
      },
      {
        header: 'Usuario',
        id: 'user.full_name',
        accessorFn: row => row.user?.fullName || '-',
        size: 150
      },
      {
        header: 'Referencia',
        id: 'reference',
        accessorFn: row =>
          row.referenceType && row.referenceId
            ? `${row.referenceType.split('\\').pop()} #${row.referenceId}`
            : '-',
        size: 150
      }
    ],
    []
  );

  const [selectedWarehouse, setSelectedWarehouse] = useState<number | ''>('');
  const [selectedType, setSelectedType] = useState<string | ''>('');

  const { data: warehousesData } = useWarehousesQuery({
    options: {}
  });
  const warehouses = useMemo(
    () => warehousesData?.data || [],
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

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          <Tab label='Movimientos (Kardex)' />
          <Tab label='Transferencias' />
        </Tabs>
      </Box>

      {activeTab === 0 && (
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
                    <Box display='flex' alignItems='center' gap={1}>
                      <ArrowUp size={16} color='green' />
                      Entrada
                    </Box>
                  </MenuItem>
                  <MenuItem value='exit'>
                    <Box display='flex' alignItems='center' gap={1}>
                      <ArrowDown size={16} color='red' />
                      Salida
                    </Box>
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
                {permissions.includes(
                  'inventory-movements.create-transfer'
                ) && (
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
      )}

      {activeTab === 1 && <TransfersTab />}

      {isOpen && (
        <CreateTransferDrawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
