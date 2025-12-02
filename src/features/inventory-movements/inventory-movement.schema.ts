import { z } from 'zod';

export const inventoryTransferSchema = z
  .object({
    source_warehouse_id: z.number({
      required_error: 'El almacén origen es requerido'
    }),
    destination_warehouse_id: z.number({
      required_error: 'El almacén destino es requerido'
    }),
    notes: z.string().optional(),
    products: z
      .array(
        z.object({
          product_id: z.number({ required_error: 'El producto es requerido' }),
          quantity: z.coerce
            .number({
              required_error: 'La cantidad es requerida',
              invalid_type_error: 'La cantidad es requerida'
            })
            .positive('La cantidad debe ser mayor a 0'),
          source_location_id: z.number({
            required_error: 'Ubic. Origen requerida'
          }),
          destination_location_id: z.number({
            required_error: 'Ubic. Destino requerida'
          }),
          batch_id: z.number().nullable().optional()
        })
      )
      .min(1, 'Debes agregar al menos un producto')
  })
  .refine(data => data.source_warehouse_id !== data.destination_warehouse_id, {
    message: 'El almacén destino no puede ser igual al origen',
    path: ['destination_warehouse_id']
  });

export type InventoryTransferDto = z.infer<typeof inventoryTransferSchema>;
