import { useEffect, FC } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
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
import { Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { toast } from 'sonner';

import { CustomDrawer } from '@/components/shared/CustomDrawer';
import {
  useTransferQuery,
  useReceiveTransferMutation
} from '@/features/transfers/hooks/transfers.query';

const inputSx = {
  '& .MuiInputBase-input': { textAlign: 'right', fontWeight: 'bold' }
};

interface ReceiveTransferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transferId: number | null;
}

interface ReceiveFormValues {
  items: {
    transfer_item_id: number;
    product_name: string;
    product_type: string;
    measure_unit: string;
    quantity_sent: number;
    quantity_received: number;
    quantity_missing: number;
    quantity_damaged: number;
    location_suggested: string;
  }[];
  receiving_notes: string;
}

export const ReceiveTransferDrawer: FC<ReceiveTransferDrawerProps> = ({
  isOpen,
  onClose,
  transferId
}) => {
  const { data: transfer, isLoading } = useTransferQuery({
    id: transferId!,
    options: {
      include: [
        'items',
        'items.product',
        'items.product.productType',
        'items.product.measureUnit',
        'sourceWarehouse',
        'destinationWarehouse'
      ]
    },
    enabled: !!transferId
  });

  const mutation = useReceiveTransferMutation();

  const { control, handleSubmit, setValue, watch, reset } =
    useForm<ReceiveFormValues>({
      defaultValues: { items: [], receiving_notes: '' }
    });

  const { fields } = useFieldArray({ control, name: 'items' });
  const items = watch('items');

  useEffect(() => {
    if (transfer && transfer.items) {
      const formItems = transfer.items.map((item: any) => ({
        transfer_item_id: item.id,
        product_name: item.product?.name || 'Desconocido',
        product_type: item.product?.productType?.name || '-',
        measure_unit: item.product?.measureUnit?.code || 'U',
        quantity_sent: Number(item.quantitySent),
        quantity_received: Number(item.quantitySent),
        quantity_missing: 0,
        quantity_damaged: 0,
        location_suggested: item.destinationLocation
          ? 'Pasillo X (Planificado)'
          : 'Sin asignar'
      }));

      setValue('items', formItems);
      setValue('receiving_notes', '');
    }
  }, [transfer, setValue]);

  const onSubmit = (data: ReceiveFormValues) => {
    if (!transferId) return;

    const payload = {
      items: data.items.map(item => ({
        transfer_item_id: item.transfer_item_id,
        quantity_received: Number(item.quantity_received),
        quantity_missing: Number(item.quantity_missing),
        quantity_damaged: Number(item.quantity_damaged)
      })),
      receiving_notes: data.receiving_notes
    };

    mutation.mutate(
      { id: transferId, data: payload },
      {
        onSuccess: () => {
          toast.success('Recepción confirmada exitosamente');
          onClose();
          reset();
        },
        onError: () => toast.error('Error al procesar la recepción')
      }
    );
  };

  return (
    <CustomDrawer
      open={isOpen}
      title={`Recibir Transferencia #${transfer?.transferNumber || '...'}`}
      width='1000px'
      footer={
        <Box display='flex' justifyContent='flex-end' gap={2} width='100%'>
          <Button color='inherit' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            color='primary'
            disabled={mutation.isPending}
            startIcon={<Save size={18} />}
            onClick={handleSubmit(onSubmit)}
          >
            {mutation.isPending ? 'Procesando...' : 'Confirmar Entrada'}
          </Button>
        </Box>
      }
      onClose={onClose}
    >
      {isLoading ? (
        <Box display='flex' justifyContent='center' p={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display='flex' flexDirection='column' gap={3}>
          <Paper variant='outlined' sx={{ p: 2, bgcolor: '#F8FAFC' }}>
            <Typography variant='subtitle2' color='textSecondary'>
              Ruta del Envío
            </Typography>
            <Box display='flex' alignItems='center' gap={2} mt={1}>
              <Typography fontWeight={600}>
                {transfer?.sourceWarehouse?.name}
              </Typography>
              <Typography color='textSecondary'>→</Typography>
              <Typography fontWeight={600}>
                {transfer?.destinationWarehouse?.name}
              </Typography>
            </Box>
            <Typography variant='caption' display='block' mt={1}>
              Notas de envío: {transfer?.notes || 'Ninguna'}
            </Typography>
          </Paper>

          <TableContainer component={Paper} variant='outlined'>
            <Table size='small'>
              <TableHead>
                <TableRow
                  sx={{ '& th': { bgcolor: '#F1F5F9', fontWeight: 600 } }}
                >
                  <TableCell>Producto</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align='center'>Ubicación Destino</TableCell>
                  <TableCell align='right' width={100}>
                    Enviado
                  </TableCell>
                  <TableCell align='right' width={100}>
                    Recibido
                  </TableCell>
                  <TableCell align='right' width={100}>
                    Faltante
                  </TableCell>
                  <TableCell align='right' width={100}>
                    Dañado
                  </TableCell>
                  <TableCell align='center' width={50}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => {
                  const received = watch(`items.${index}.quantity_received`);
                  const missing = watch(`items.${index}.quantity_missing`);
                  const damaged = watch(`items.${index}.quantity_damaged`);
                  const sent = field.quantity_sent;

                  const totalAccounted =
                    Number(received) + Number(missing) + Number(damaged);
                  const isDifference = totalAccounted !== sent;

                  return (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Box>
                          <Typography variant='body2' fontWeight={500}>
                            {field.product_name}
                          </Typography>
                          <Typography variant='caption' color='textSecondary'>
                            U.M.: {field.measure_unit}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant='caption'
                          sx={{
                            bgcolor: '#F1F5F9',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 500
                          }}
                        >
                          {field.product_type}
                        </Typography>
                      </TableCell>
                      <TableCell align='center'>
                        <Typography
                          variant='caption'
                          sx={{
                            bgcolor: '#EFF6FF',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                        >
                          {field.location_suggested}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography variant='body2' color='textSecondary'>
                          {field.quantity_sent}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Controller
                          name={`items.${index}.quantity_received`}
                          control={control}
                          rules={{ min: 0 }}
                          render={({ field: inputProps }) => (
                            <TextField
                              {...inputProps}
                              type='number'
                              size='small'
                              variant='standard'
                              InputProps={{ disableUnderline: true }}
                              sx={{
                                ...inputSx,
                                bgcolor: 'transparent',
                                borderRadius: 1,
                                px: 1,
                                border: '1px solid #e2e8f0'
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <Controller
                          name={`items.${index}.quantity_missing`}
                          control={control}
                          rules={{ min: 0 }}
                          render={({ field: inputProps }) => (
                            <TextField
                              {...inputProps}
                              type='number'
                              size='small'
                              variant='standard'
                              InputProps={{ disableUnderline: true }}
                              sx={{
                                ...inputSx,
                                bgcolor: 'transparent',
                                borderRadius: 1,
                                px: 1,
                                border: '1px solid #e2e8f0',
                                '& .MuiInputBase-input': { color: '#d97706' }
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <Controller
                          name={`items.${index}.quantity_damaged`}
                          control={control}
                          rules={{ min: 0 }}
                          render={({ field: inputProps }) => (
                            <TextField
                              {...inputProps}
                              type='number'
                              size='small'
                              variant='standard'
                              InputProps={{ disableUnderline: true }}
                              sx={{
                                ...inputSx,
                                bgcolor: 'transparent',
                                borderRadius: 1,
                                px: 1,
                                border: '1px solid #e2e8f0',
                                '& .MuiInputBase-input': { color: '#dc2626' }
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align='center'>
                        {isDifference ? (
                          <Tooltip title='La suma (Recibido + Faltante + Dañado) no coincide con lo Enviado'>
                            <AlertTriangle
                              size={18}
                              className='text-amber-500'
                            />
                          </Tooltip>
                        ) : (
                          <CheckCircle size={18} className='text-green-500' />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {items.some(
            i =>
              Number(i.quantity_received) +
                Number(i.quantity_missing) +
                Number(i.quantity_damaged) !==
              i.quantity_sent
          ) && (
            <Alert severity='warning'>
              Hay diferencias entre lo enviado y lo recibido. Estas se
              registrarán como incidencias.
            </Alert>
          )}

          <TextField
            {...control.register('receiving_notes')}
            multiline
            fullWidth
            label='Notas de Recepción'
            placeholder='Ej: Llegó una caja mojada, faltaron piezas...'
            rows={2}
          />
        </Box>
      )}
    </CustomDrawer>
  );
};
