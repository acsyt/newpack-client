import { useState, useCallback } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  open: boolean;
  onConfirm?: () => void;
}

export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    open: false,
    message: ''
  });

  const confirm = useCallback(
    (options: ConfirmDialogOptions): Promise<boolean> => {
      return new Promise(resolve => {
        setDialogState({
          open: true,
          title: options.title || 'Confirmar acción',
          message: options.message,
          confirmText: options.confirmText || 'Confirmar',
          cancelText: options.cancelText || 'Cancelar',
          variant: options.variant || 'warning',
          onConfirm: () => {
            setDialogState(prev => ({ ...prev, open: false }));
            resolve(true);
          }
        });
      });
    },
    []
  );

  const handleCancel = useCallback(() => {
    setDialogState(prev => ({ ...prev, open: false }));
  }, []);

  const ConfirmDialog = useCallback(
    () => (
      <Dialog
        fullWidth
        open={dialogState.open}
        maxWidth='xs'
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
        onClose={handleCancel}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            pb: 1
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor:
                dialogState.variant === 'danger'
                  ? 'error.lighter'
                  : dialogState.variant === 'warning'
                    ? 'warning.lighter'
                    : 'info.lighter'
            }}
          >
            <AlertTriangle
              size={22}
              color={
                dialogState.variant === 'danger'
                  ? 'var(--mui-palette-error-main)'
                  : dialogState.variant === 'warning'
                    ? 'var(--mui-palette-warning-main)'
                    : 'var(--mui-palette-info-main)'
              }
            />
          </Box>
          <Typography variant='h6' fontWeight={600}>
            {dialogState.title}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography variant='body1' color='text.secondary'>
            {dialogState.message}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant='outlined' color='inherit' onClick={handleCancel}>
            {dialogState.cancelText}
          </Button>
          <Button
            autoFocus
            variant='contained'
            color={dialogState.variant === 'danger' ? 'error' : 'primary'}
            onClick={dialogState.onConfirm}
          >
            {dialogState.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    ),
    [dialogState, handleCancel]
  );

  return { confirm, ConfirmDialog };
};
