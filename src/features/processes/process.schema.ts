import { z } from 'zod';

export const processSchema = z.object({
  code: z.string().min(1, 'El código es requerido').max(50),
  name: z.string().min(1, 'El nombre es requerido').max(255),
  appliesToPt: z.boolean().optional().default(false),
  appliesToMp: z.boolean().optional().default(false),
  appliesToCompounds: z.boolean().optional().default(false)
});

export type ProcessDto = z.infer<typeof processSchema>;
