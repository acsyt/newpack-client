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
    quantity_sent: number;
    quantity_received: number;
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

  useEffect(() => {
    if (transfer && transfer.items) {
      const formItems = transfer.items.map((item: any) => ({
        transfer_item_id: item.id,
        product_name: item.product?.name || 'Desconocido',
        quantity_sent: Number(item.quantitySent),
        quantity_received: Number(item.quantitySent),
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
        quantity_received: Number(item.quantity_received)
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
      width='900px'
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
                  <TableCell align='center'>Ubicación Destino</TableCell>
                  <TableCell align='right' width={100}>
                    Enviado
                  </TableCell>
                  <TableCell align='right' width={120}>
                    Recibido
                  </TableCell>
                  <TableCell align='center' width={50}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => {
                  const received = watch(`items.${index}.quantity_received`);
                  const sent = field.quantity_sent;
                  const isDifference = Number(received) !== sent;

                  return (
                    <TableRow key={field.id}>
                      <TableCell>{field.product_name}</TableCell>
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
                              error={isDifference}
                              InputProps={{ disableUnderline: true }}
                              sx={{
                                ...inputSx,
                                bgcolor: isDifference
                                  ? '#FEF2F2'
                                  : 'transparent',
                                borderRadius: 1,
                                px: 1
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align='center'>
                        {isDifference ? (
                          <Tooltip title='Diferencia detectada (Faltante/Sobrante)'>
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

          {watch('items').some(
            i => Number(i.quantity_received) !== i.quantity_sent
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
