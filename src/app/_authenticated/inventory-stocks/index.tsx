import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { createFileRoute } from '@tanstack/react-router';
import { Download, Plus } from 'lucide-react';

import { DashboardLayoutContainer } from '@/components/layouts/dashboard/DashboardLayoutContainer';
import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { MovementType } from '@/features/inventory-movements/inventory-movement.interface';
import { useInventoryMovementDrawerStore } from '@/features/inventory-movements/store/useInventoryMovementDrawerStore';
import { columns } from '@/features/inventory-stocks/components/stock-table/columns';
import { useInventoryStocksQuery } from '@/features/inventory-stocks/hooks/inventory-stocks.query';
import { InventoryStockParams } from '@/features/inventory-stocks/inventory-stock.interface';
import { useWarehousesQuery } from '@/features/warehouses/hooks/warehouses.query';

export const Route = createFileRoute('/_authenticated/inventory-stocks/')({
  component: RouteComponent
});

function RouteComponent() {
  const memoizedColumns = useMemo(() => columns, []);
  const { permissions } = useAuth();
  const { onOpen } = useInventoryMovementDrawerStore();

  const [selectedWarehouse, setSelectedWarehouse] = useState<number | ''>('');
  const [selectedProductType, setSelectedProductType] = useState<number | ''>(
    ''
  );
  const [selectedStatus, setSelectedStatus] = useState<string | ''>('');

  const { data: warehousesData } = useWarehousesQuery({
    options: {}
  });

  const warehouses = warehousesData?.data || [];

  const productTypes = [
    { id: 1, name: 'Materia Prima', code: 'MP' },
    { id: 2, name: 'Producto Terminado', code: 'PT' },
    { id: 3, name: 'Compuesto', code: 'COMP' },
    { id: 4, name: 'Servicio', code: 'SERV' },
    { id: 5, name: 'Refacciones', code: 'REF' }
  ];

  const stockParams: InventoryStockParams = {
    include: [
      'product',
      'product.measureUnit',
      'product.productType',
      'warehouse',
      'warehouseLocation',
      'batch'
    ],
    filter: {
      ...(selectedWarehouse && { warehouse_id: selectedWarehouse }),
      ...(selectedProductType && { product_type_id: selectedProductType }),
      ...(selectedStatus && { status: selectedStatus as any })
    }
  };

  const onClearFilters = () => {
    setSelectedWarehouse('');
    setSelectedProductType('');
    setSelectedStatus('');
  };

  const hasActiveFilters =
    selectedWarehouse !== '' ||
    selectedProductType !== '' ||
    selectedStatus !== '';

  const handleExport = () => {};

  return (
    <DashboardLayoutContainer title='Reporte de Inventarios'>
      <CustomTable
        queryHook={useInventoryStocksQuery}
        queryProps={{
          options: stockParams
        }}
        columns={memoizedColumns}
        enableRowActions={false}
        initialState={{
          sorting: [{ id: 'id', desc: true }],
          columnVisibility: { id: false }
        }}
        renderTopToolbarCustomActions={() => (
          <Box display='flex' gap={2} alignItems='flex-end' flexWrap='wrap'>
            <FormControl size='small' sx={{ minWidth: 200 }}>
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

            <FormControl size='small' sx={{ minWidth: 200 }}>
              <InputLabel>Tipo de Producto</InputLabel>
              <Select
                displayEmpty
                value={selectedProductType}
                label='Tipo de Producto'
                onChange={e =>
                  setSelectedProductType(e.target.value as number | '')
                }
              >
                <MenuItem value=''>
                  <em>Todos los tipos</em>
                </MenuItem>
                {productTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size='small' sx={{ minWidth: 180 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                displayEmpty
                value={selectedStatus}
                label='Estado'
                onChange={e => setSelectedStatus(e.target.value)}
              >
                <MenuItem value=''>
                  <em>Todos los estados</em>
                </MenuItem>
                <MenuItem value='available'>Disponible</MenuItem>
                <MenuItem value='reserved'>Reservado</MenuItem>
                <MenuItem value='damaged'>Dañado</MenuItem>
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
            )}

            <Box display='flex' gap={1} marginLeft='auto'>
              <Button
                variant='outlined'
                color='primary'
                size='small'
                startIcon={<Download size={16} />}
                onClick={handleExport}
              >
                Exportar Reporte
              </Button>

              {permissions.includes('inventory-movements.create-transfer') && (
                <Button
                  variant='contained'
                  color='primary'
                  size='small'
                  startIcon={<Plus size={16} />}
                  onClick={() => onOpen(MovementType.Transfer)}
                >
                  Crear Transferencia
                </Button>
              )}
            </Box>
          </Box>
        )}
      />
    </DashboardLayoutContainer>
  );
}
