import { z } from 'zod';

import { ModeAction } from '@/config/enums/mode-action.enum';

export const baseSchema = z.object({
  code: z.string().min(1, 'El código es requerido').max(50),
  name: z.string().min(1, 'El nombre es requerido').max(255),
  process_id: z.number().positive(),
  speed_mh: z.number().optional().nullable(),
  speed_kgh: z.number().optional().nullable(),
  circumference_total: z.number().optional().nullable(),
  max_width: z.number().optional().nullable(),
  max_center: z.number().optional().nullable()
});

const createMachineSchema = baseSchema.extend({
  mode: z.literal(ModeAction.Create)
});

const updateMachineSchema = baseSchema.extend({
  id: z.number(),
  mode: z.enum([ModeAction.Edit, ModeAction.Show])
});

export const machineSchema = z.discriminatedUnion('mode', [
  createMachineSchema,
  updateMachineSchema
]);

export type MachineDto = z.infer<typeof machineSchema>;
