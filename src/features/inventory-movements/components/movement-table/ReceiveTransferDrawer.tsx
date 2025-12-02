import { FC, useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Check } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  useReceiveTransferMutation,
  useTransferQuery
} from '../../../transfers/hooks/transfers.query';

import { CustomDrawer } from '@/components/shared/CustomDrawer';
import { getErrorMessage } from '@/config/error.mapper';

interface ReceiveTransferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transferId: number | null;
}

type ReceiveFormData = {
  receiving_notes?: string;
  items: Array<{
    transfer_item_id: number;
    quantity_received: number;
    quantity_missing?: number;
    quantity_damaged?: number;
  }>;
};

export const ReceiveTransferDrawer: FC<ReceiveTransferDrawerProps> = ({
  isOpen,
  onClose,
  transferId
}) => {
  const { data: transfer, isLoading } = useTransferQuery({
    id: transferId || 0,
    options: {
      include: [
        'items',
        'items.product',
        'items.product.measureUnit',
        'items.sourceLocation',
        'items.destinationLocation',
        'sourceWarehouse',
        'destinationWarehouse'
      ]
    },
    enabled: isOpen && !!transferId
  });

  const receiveMutation = useReceiveTransferMutation();

  const defaultValues = useMemo(() => {
    if (!transfer?.items) return { receiving_notes: '', items: [] };

    return {
      receiving_notes: '',
      items: transfer.items.map(item => ({
        transfer_item_id: item.id,
        quantity_received: Number(item.quantitySent) || 0,
        quantity_missing: 0,
        quantity_damaged: 0
      }))
    };
  }, [transfer]);

  const { control, handleSubmit, reset } = useForm<ReceiveFormData>({
    defaultValues,
    values: defaultValues
  });

  const onSubmit = (data: ReceiveFormData) => {
    if (!transferId) return;

    receiveMutation.mutate(
      { id: transferId, data },
      {
        onSuccess: () => {
          toast.success('Transferencia recibida exitosamente');
          reset();
          onClose();
        },
        onError: (error: any) => {
          const message = getErrorMessage(error);

          toast.error(message);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <CustomDrawer
        open={isOpen}
        title='Recibir Transferencia'
        onClose={onClose}
      >
        <Box display='flex' justifyContent='center' p={4}>
          <Typography>Cargando...</Typography>
        </Box>
      </CustomDrawer>
    );
  }

  if (!transfer) return null;

  return (
    <CustomDrawer
      open={isOpen}
      title={`Recibir Transferencia ${transfer.transferNumber}`}
      width='900px'
      footer={
        <Box display='flex' justifyContent='space-between' width='100%' gap={2}>
          <Typography variant='caption' color='text.secondary'>
            {transfer.sourceWarehouse?.name} →{' '}
            {transfer.destinationWarehouse?.name}
          </Typography>
          <Box display='flex' gap={2}>
            <Button color='inherit' onClick={onClose}>
              Cancelar
            </Button>
            <Button
              disableElevation
              variant='contained'
              disabled={receiveMutation.isPending}
              startIcon={<Check size={18} />}
              onClick={handleSubmit(onSubmit)}
            >
              {receiveMutation.isPending
                ? 'Procesando...'
                : 'Confirmar Recepción'}
            </Button>
          </Box>
        </Box>
      }
      onClose={onClose}
    >
      <Box className='flex flex-col gap-4'>
        <Box
          sx={{
            p: 2,
            bgcolor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 2
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            Ingresa la cantidad <strong>realmente recibida</strong> para cada
            producto. Si hay diferencias (daños, faltantes), solo se agregará al
            stock la cantidad que confirmes.
          </Typography>
        </Box>

        <TableContainer
          component={Paper}
          variant='outlined'
          sx={{ borderRadius: 2 }}
        >
          <Table size='small'>
            <TableHead>
              <TableRow
                sx={{ '& th': { bgcolor: '#F1F5F9', fontWeight: 600 } }}
              >
                <TableCell width='30%'>Producto</TableCell>
                <TableCell width='12%' align='right'>
                  Qty Enviada
                </TableCell>
                <TableCell width='14%' align='center'>
                  Qty Recibida
                </TableCell>
                <TableCell width='13%' align='center'>
                  Faltantes
                </TableCell>
                <TableCell width='13%' align='center'>
                  Dañados
                </TableCell>
                <TableCell width='18%'>Ubicación Destino</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transfer.items?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box>
                      <Typography variant='body2' fontWeight={500}>
                        {item.product?.name || 'N/A'}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        SKU: {item.product?.sku || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align='right'>
                    <Typography
                      variant='body2'
                      fontWeight={600}
                      color='primary.main'
                    >
                      {Number(item.quantitySent).toFixed(2)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Controller
                      control={control}
                      name={`items.${index}.quantity_received`}
                      rules={{
                        required: 'Requerido',
                        min: { value: 0, message: 'Debe ser >= 0' }
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          size='small'
                          error={!!error}
                          helperText={error?.message}
                          inputProps={{ min: 0, step: 0.0001 }}
                          sx={{ maxWidth: 120 }}
                        />
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    <Controller
                      control={control}
                      name={`items.${index}.quantity_missing`}
                      rules={{
                        min: { value: 0, message: '>= 0' }
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          size='small'
                          error={!!error}
                          helperText={error?.message}
                          inputProps={{ min: 0, step: 0.0001 }}
                          sx={{ maxWidth: 110 }}
                        />
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    <Controller
                      control={control}
                      name={`items.${index}.quantity_damaged`}
                      rules={{
                        min: { value: 0, message: '>= 0' }
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          size='small'
                          error={!!error}
                          helperText={error?.message}
                          inputProps={{ min: 0, step: 0.0001 }}
                          sx={{ maxWidth: 110 }}
                        />
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {item.destinationLocation
                        ? `${item.destinationLocation.aisle}-${item.destinationLocation.shelf}-${item.destinationLocation.section}`
                        : 'N/A'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Controller
          control={control}
          name='receiving_notes'
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              fullWidth
              label='Notas de Recepción (Opcional)'
              rows={3}
              placeholder='Ej: 2 unidades llegaron dañadas, 1 faltante...'
              variant='outlined'
              size='small'
            />
          )}
        />
      </Box>
    </CustomDrawer>
  );
};
