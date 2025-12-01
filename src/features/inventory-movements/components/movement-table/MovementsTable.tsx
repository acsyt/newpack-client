import type { FC } from 'react';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';

import { MovementType } from '../../inventory-movement.interface';
import { useInventoryMovementDrawerStore } from '../../store/useInventoryMovementDrawerStore';

import { columns } from './columns';
import { CreateTransferDrawer } from './CreateTransferDrawer';
import { SaveInventoryMovementDrawer } from './SaveInventoryMovementDrawer';

import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { useInventoryMovementsQuery } from '@/features/inventory-movements/hooks/inventory-movements.query';
import { InventoryMovementParams } from '@/features/inventory-movements/inventory-movement.interface';
import { useWarehousesQuery } from '@/features/warehouses/hooks/warehouses.query';

interface MovementsTableProps {}

export const MovementsTable: FC<MovementsTableProps> = ({}) => {
  const { permissions } = useAuth();
  const { onOpen } = useInventoryMovementDrawerStore();
  const memoizedColumns = useMemo(() => columns, []);

  const [selectedWarehouse, setSelectedWarehouse] = useState<number | ''>('');
  const [selectedType, setSelectedType] = useState<string | ''>('');

  const { data: warehousesData } = useWarehousesQuery({
    options: {}
  });

  const warehouses = warehousesData?.data || [];

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

  const onClearFilters = () => {
    setSelectedWarehouse('');
    setSelectedType('');
  };

  const hasActiveFilters = selectedWarehouse !== '' || selectedType !== '';

  const { isOpen: isTransferOpen } = useInventoryMovementDrawerStore();

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
          <Box display='flex' gap={2} alignItems='flex-end' flexWrap='wrap'>
            {/* <FormControl size='small' sx={{ minWidth: 200 }}>
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

            <FormControl size='small' sx={{ minWidth: 220 }}>
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
                <MenuItem value='purchase_entry'>
                  <Box display='flex' alignItems='center' gap={1}>
                    <ArrowUp size={16} color='green' />
                    Entrada por Compra
                  </Box>
                </MenuItem>
                <MenuItem value='production_output'>
                  <Box display='flex' alignItems='center' gap={1}>
                    <ArrowUp size={16} color='green' />
                    Salida de Producción
                  </Box>
                </MenuItem>
                <MenuItem value='production_consumption'>
                  <Box display='flex' alignItems='center' gap={1}>
                    <ArrowDown size={16} color='red' />
                    Consumo Producción
                  </Box>
                </MenuItem>
                <MenuItem value='sales_shipment'>
                  <Box display='flex' alignItems='center' gap={1}>
                    <ArrowDown size={16} color='red' />
                    Salida por Venta
                  </Box>
                </MenuItem>
                <MenuItem value='adjustment'>
                  <Box display='flex' alignItems='center' gap={1}>
                    Ajuste
                  </Box>
                </MenuItem>
                <MenuItem value='transfer'>
                  <Box display='flex' alignItems='center' gap={1}>
                    Transferencia
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {hasActiveFilters && (
              <Button
                variant='outlined'
                size='small'
                sx={{ height: 40 }}
                onClick={onClearFilters}
              >
                Limpiar filtros
              </Button>
            )} */}

            <Box display='flex' gap={1} marginLeft='auto'>
              {permissions.includes('inventory-movements.create-entry') && (
                <Button
                  variant='contained'
                  color='success'
                  size='small'
                  startIcon={<ArrowUp size={16} />}
                  onClick={() => onOpen(MovementType.Entry)}
                >
                  Nueva Entrada
                </Button>
              )}

              {permissions.includes('inventory-movements.create-exit') && (
                <Button
                  variant='contained'
                  color='error'
                  size='small'
                  startIcon={<ArrowDown size={16} />}
                  onClick={() => onOpen(MovementType.Exit)}
                >
                  Nueva Salida
                </Button>
              )}

              {permissions.includes('inventory-movements.create-transfer') && (
                <Button
                  variant='outlined'
                  color='primary'
                  size='small'
                  startIcon={<Plus size={16} />}
                  onClick={() => onOpen(MovementType.Transfer)}
                >
                  Transferencia
                </Button>
              )}
            </Box>
          </Box>
        )}
      />
      <SaveInventoryMovementDrawer />

      <CreateTransferDrawer />
    </>
  );
};
