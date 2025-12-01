import { useState, useMemo } from 'react';

import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
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
import { X, Plus, Pencil, Trash2, MapPin, Eye, Search } from 'lucide-react';

import { SaveLocationDrawer } from './SaveLocationDrawer';

import {
  useWarehouseLocationsQuery,
  useDeleteWarehouseLocationMutation
} from '@/features/warehouses/hooks/warehouses.query';
import { useWarehouseLocationDrawerStore } from '@/features/warehouses/store/useWarehouseDrawerStore';
import {
  Warehouse,
  WarehouseLocation
} from '@/features/warehouses/warehouse.interface';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { useAuthStore } from '@/stores/auth.store';

interface WarehouseLocationsModalProps {
  open: boolean;
  onClose: () => void;
  warehouse: Warehouse;
}

export const WarehouseLocationsDialog = ({
  open,
  onClose,
  warehouse
}: WarehouseLocationsModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const can = useAuthStore(state => state.can);

  const {
    isOpen: isDrawerOpen,
    mode,
    item: location,
    onCreate,
    onEdit,
    onShow,
    onClose: onCloseDrawer
  } = useWarehouseLocationDrawerStore();

  const { confirm, ConfirmDialog } = useConfirmDialog();

  const { data: locationsData, isLoading } = useWarehouseLocationsQuery({
    options: {
      filter: { warehouse_id: [warehouse.id] },
      has_pagination: false
    },
    enabled: open
  });

  const deleteMutation = useDeleteWarehouseLocationMutation({
    warehouseId: warehouse.id
  });

  const locations = useMemo(() => {
    const data = locationsData?.data || [];

    if (!searchQuery) return data;

    const normalizeText = (text: string) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');

    const normalizedQuery = normalizeText(searchQuery);

    return data.filter(location => {
      const normalizedId = normalizeText(location.id.toString());
      const normalizedAisle = normalizeText(location.aisle || '');
      const normalizedShelf = normalizeText(location.shelf || '');
      const normalizedSection = normalizeText(location.section || '');

      return (
        normalizedId.includes(normalizedQuery) ||
        normalizedAisle.includes(normalizedQuery) ||
        normalizedShelf.includes(normalizedQuery) ||
        normalizedSection.includes(normalizedQuery)
      );
    });
  }, [locationsData?.data, searchQuery]);

  const canView = can('warehouse-locations.index');
  const canCreate = can('warehouse-locations.create');
  const canEdit = can('warehouse-locations.edit');
  const canDelete = can('warehouse-locations.delete');

  const onDelete = async (locationId: number) => {
    const confirmed = await confirm({
      title: 'Eliminar ubicación',
      message:
        '¿Estás seguro de eliminar esta ubicación? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'danger'
    });

    if (confirmed) {
      deleteMutation.mutate(locationId);
    }
  };

  const LocationCard = ({ location }: { location: WarehouseLocation }) => (
    <div className='border border-divider rounded-lg p-4 mb-3 hover:bg-action-hover transition-colors'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-1'>
            <Chip label={`#${location.id}`} size='small' />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-2 mb-3'>
        <div>
          <Typography
            variant='caption'
            className='text-text-secondary block mb-1'
          >
            Pasillo
          </Typography>
          {location.aisle ? (
            <Chip label={location.aisle} size='small' variant='outlined' />
          ) : (
            <Typography variant='body2' className='text-text-secondary'>
              -
            </Typography>
          )}
        </div>
        <div>
          <Typography
            variant='caption'
            className='text-text-secondary block mb-1'
          >
            Estante
          </Typography>
          {location.shelf ? (
            <Chip label={location.shelf} size='small' variant='outlined' />
          ) : (
            <Typography variant='body2' className='text-text-secondary'>
              -
            </Typography>
          )}
        </div>
        <div>
          <Typography
            variant='caption'
            className='text-text-secondary block mb-1'
          >
            Sección
          </Typography>
          {location.section ? (
            <Chip label={location.section} size='small' variant='outlined' />
          ) : (
            <Typography variant='body2' className='text-text-secondary'>
              -
            </Typography>
          )}
        </div>
      </div>

      <div className='flex gap-2 justify-end pt-2 border-t border-divider'>
        {canView && (
          <Tooltip title='Ver detalle'>
            <IconButton size='small' onClick={() => onShow(location)}>
              <Eye size={16} />
            </IconButton>
          </Tooltip>
        )}
        {canEdit && (
          <Tooltip title='Editar'>
            <IconButton size='small' onClick={() => onEdit(location)}>
              <Pencil size={16} />
            </IconButton>
          </Tooltip>
        )}
        {canDelete && (
          <Tooltip title='Eliminar'>
            <IconButton
              size='small'
              color='error'
              disabled={deleteMutation.isPending}
              onClick={() => onDelete(location.id)}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        slotProps={{
          backdrop: {
            sx: { zIndex: 1199 }
          }
        }}
        PaperProps={{
          className: 'rounded-2xl min-h-[400px] m-2 sm:m-4',
          sx: { zIndex: 1200 }
        }}
        onClose={onClose}
      >
        <DialogTitle className='border-b border-divider pb-3'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <MapPin size={24} className='text-primary-main' />
                <div>
                  <Typography
                    variant='h6'
                    className='font-semibold leading-tight'
                  >
                    Ubicaciones - {warehouse.name}
                  </Typography>
                  <Typography variant='caption' className='text-text-secondary'>
                    {warehouse.warehouseLocationsCount}{' '}
                    {warehouse.warehouseLocationsCount > 1
                      ? 'ubicaciones'
                      : 'ubicación'}
                  </Typography>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                {canCreate && (
                  <Button
                    variant='contained'
                    size='small'
                    startIcon={<Plus size={16} />}
                    className='whitespace-nowrap'
                    onClick={onCreate}
                  >
                    Nueva
                  </Button>
                )}
                <IconButton size='small' onClick={onClose}>
                  <X size={20} />
                </IconButton>
              </div>
            </div>

            <TextField
              fullWidth
              size='small'
              placeholder='Buscar por ID, pasillo, estante...'
              value={searchQuery}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search size={16} className='text-text-secondary' />
                  </InputAdornment>
                )
              }}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </DialogTitle>

        <DialogContent className='p-0'>
          {isLoading ? (
            <div className='flex justify-center items-center min-h-[300px]'>
              <CircularProgress />
            </div>
          ) : locations.length === 0 ? (
            <div className='flex flex-col justify-center items-center min-h-[300px] gap-4 p-4'>
              <MapPin size={48} strokeWidth={1.5} opacity={0.3} />
              <Typography
                variant='body1'
                className='text-text-secondary text-center'
              >
                No hay ubicaciones registradas
              </Typography>
              {canCreate && (
                <Button
                  variant='outlined'
                  startIcon={<Plus size={16} />}
                  onClick={onCreate}
                >
                  Crear primera ubicación
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className='hidden md:block'>
                <TableContainer component={Paper} elevation={0}>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>ID</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Pasillo</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Estante</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Sección</strong>
                        </TableCell>
                        <TableCell align='right'>
                          <strong>Acciones</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {locations.map(location => (
                        <TableRow
                          key={location.id}
                          hover
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell>
                            <Chip label={location.id} size='small' />
                          </TableCell>
                          <TableCell>
                            {location.aisle ? (
                              <Chip
                                label={location.aisle}
                                size='small'
                                variant='outlined'
                              />
                            ) : (
                              <Typography
                                variant='body2'
                                className='text-text-secondary'
                              >
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {location.shelf ? (
                              <Chip
                                label={location.shelf}
                                size='small'
                                variant='outlined'
                              />
                            ) : (
                              <Typography
                                variant='body2'
                                className='text-text-secondary'
                              >
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {location.section ? (
                              <Chip
                                label={location.section}
                                size='small'
                                variant='outlined'
                              />
                            ) : (
                              <Typography
                                variant='body2'
                                className='text-text-secondary'
                              >
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align='right'>
                            <div className='flex gap-1 justify-end'>
                              {canView && (
                                <Tooltip title='Ver detalle'>
                                  <IconButton
                                    size='small'
                                    onClick={() => onShow(location)}
                                  >
                                    <Eye size={16} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {canEdit && (
                                <Tooltip title='Editar'>
                                  <IconButton
                                    size='small'
                                    onClick={() => onEdit(location)}
                                  >
                                    <Pencil size={16} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {canDelete && (
                                <Tooltip title='Eliminar'>
                                  <IconButton
                                    size='small'
                                    color='error'
                                    disabled={deleteMutation.isPending}
                                    onClick={() => onDelete(location.id)}
                                  >
                                    <Trash2 size={16} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div className='block md:hidden p-4'>
                {locations.map(location => (
                  <LocationCard key={location.id} location={location} />
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {isDrawerOpen && (
        <SaveLocationDrawer
          isOpen={isDrawerOpen}
          mode={mode}
          warehouseId={warehouse.id}
          location={location ?? undefined}
          onClose={onCloseDrawer}
        />
      )}

      <ConfirmDialog />
    </>
  );
};
