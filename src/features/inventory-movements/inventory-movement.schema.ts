import { z } from 'zod';

import { MovementType } from './inventory-movement.interface';

export const inventoryMovementSchema = z.object({
  product_id: z.number({
    required_error: 'El producto es requerido',
    invalid_type_error: 'Selecciona un producto válido'
  }),
  warehouse_id: z.number({
    required_error: 'El almacén es requerido',
    invalid_type_error: 'Selecciona un almacén válido'
  }),
  warehouse_location_id: z.number().nullable().optional(),
  batch_id: z.string().nullable().optional(),
  type: z.enum([MovementType.Entry, MovementType.Exit, MovementType.Transfer], {
    required_error: 'El tipo de movimiento es requerido'
  }),
  quantity: z
    .number({
      required_error: 'La cantidad es requerida',
      invalid_type_error: 'Ingresa una cantidad válida'
    })
    .positive('La cantidad debe ser mayor a 0'),
  notes: z.string().nullable().optional()
});

export type InventoryMovementDto = z.infer<typeof inventoryMovementSchema>;
