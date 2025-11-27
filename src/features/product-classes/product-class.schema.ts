import { z } from 'zod';

export const productClassSchema = z.object({
  code: z.string().min(1, 'El código es requerido').max(50),
  name: z.string().min(1, 'El nombre es requerido').max(255),
  description: z.string().optional().nullable(),
  slug: z.string().max(255).optional().nullable()
});

export type ProductClassDto = z.infer<typeof productClassSchema>;
