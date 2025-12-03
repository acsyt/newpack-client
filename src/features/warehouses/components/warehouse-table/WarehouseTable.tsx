import type { FC } from 'react';

import { useMemo, useState } from 'react';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Eye, Pencil, Plus, MapPin } from 'lucide-react';

import { useWarehouseDrawerStore } from '../../store/useWarehouseDrawerStore';

import { warehouseColumns } from './columns';
import { SaveWarehouseDrawer } from './SaveWarehouseDrawer';
import { WarehouseLocationsDialog } from './WarehouseLocationsDialog';

import { CustomTable } from '@/components/shared/CustomTable';
import { useAuth } from '@/features/auth/hooks/mutations';
import { useWarehousesQuery } from '@/features/warehouses/hooks/warehouses.query';
import {
  Warehouse,
  WarehouseParams
} from '@/features/warehouses/warehouse.interface';

interface WarehouseTableProps {}

const warehouseParams: WarehouseParams = {};

export const WarehouseTable: FC<WarehouseTableProps> = ({}) => {
  const { permissions } = useAuth();
  const memoizedColumns = useMemo(() => warehouseColumns, []);

  const { isOpen, onCreate } = useWarehouseDrawerStore();

  const [locationsModal, setLocationsModal] = useState<{
    open: boolean;
    warehouse: Warehouse | null;
  }>({
    open: false,
    warehouse: null
  });

  const handleOpenLocations = (warehouse: Warehouse) => {
    setLocationsModal({
      open: true,
      warehouse
    });
  };

  const handleCloseLocations = () => {
    setLocationsModal({
      open: false,
      warehouse: null
    });
  };

  return (
    <>
      <CustomTable
        queryHook={useWarehousesQuery}
        queryProps={{
          options: warehouseParams
        }}
        columns={memoizedColumns}
        positionActionsColumn='last'
        renderTopToolbarCustomActions={() => (
          <Box display='flex' gap={1}>
            {permissions.includes('warehouses.create') && (
              <Button
                variant='contained'
                color='primary'
                startIcon={<Plus size={18} />}
                onClick={() => onCreate()}
              >
                Crear almacén
              </Button>
            )}
          </Box>
        )}
        renderRowActions={({ row }) => (
          <WarehouseRowAction
            warehouse={row.original}
            onOpenLocations={() => handleOpenLocations(row.original)}
          />
        )}
      />

      {isOpen && <SaveWarehouseDrawer warehouseParams={warehouseParams} />}

      {locationsModal.open && locationsModal.warehouse && (
        <WarehouseLocationsDialog
          open={locationsModal.open}
          warehouse={locationsModal.warehouse}
          onClose={handleCloseLocations}
        />
      )}
    </>
  );
};

interface WarehouseRowActionProps {
  warehouse: Warehouse;
  onOpenLocations: () => void;
}

const WarehouseRowAction: FC<WarehouseRowActionProps> = ({
  warehouse,
  onOpenLocations
}) => {
  const { permissions } = useAuth();
  const { onEdit, onShow } = useWarehouseDrawerStore();

  const locationsCount = warehouse.warehouseLocationsCount || 0;

  return (
    <Box display='flex' gap={1}>
      <Tooltip title={`Ver ubicaciones (${locationsCount})`}>
        <IconButton color='primary' onClick={onOpenLocations}>
          <Badge badgeContent={locationsCount} color='secondary' max={99}>
            <MapPin size={18} />
          </Badge>
        </IconButton>
      </Tooltip>

      {permissions.includes('warehouses.show') && (
        <Tooltip title='Ver'>
          <IconButton onClick={() => onShow(warehouse)}>
            <Eye size={18} />
          </IconButton>
        </Tooltip>
      )}

      {permissions.includes('warehouses.edit') && (
        <Tooltip title='Editar'>
          <IconButton onClick={() => onEdit(warehouse)}>
            <Pencil size={18} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
