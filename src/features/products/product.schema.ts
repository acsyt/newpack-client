import { z } from 'zod';

import { ModeAction } from '@/config/enums/mode-action.enum';

export const baseSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  sku: z.string().min(1, 'El código es requerido').max(50),
  type: z.enum(['PT', 'MP', 'SERV', 'COMP', 'REF']),
  measure_unit_id: z.number({
    required_error: 'La unidad de medida es requerida',
    invalid_type_error: 'Selecciona una unidad de medida válida'
  }),
  is_active: z.boolean().optional()
});

const createProductSchema = baseSchema.extend({
  mode: z.literal(ModeAction.Create)
});

const updateProductSchema = baseSchema.extend({
  mode: z.enum([ModeAction.Edit, ModeAction.Show])
});

export const productSchema = z.discriminatedUnion('mode', [
  createProductSchema,
  updateProductSchema
]);

export type ProductDto = z.infer<typeof productSchema>;
