import { z } from 'zod';

export const productSubclassSchema = z.object({
  code: z.string().min(1, 'El código es requerido').max(50),
  name: z.string().min(1, 'El nombre es requerido').max(255),
  productClassId: z.number().min(1, 'La clase de producto es requerida'),
  description: z.string().optional().nullable(),
  slug: z.string().max(255).optional().nullable()
});

export type ProductSubclassDto = z.infer<typeof productSubclassSchema>;
