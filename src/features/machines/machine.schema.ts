import { z } from 'zod';

export const machineSchema = z.object({
  code: z.string().min(1, 'El código es requerido').max(50),
  name: z.string().min(1, 'El nombre es requerido').max(255),
  processId: z.number().min(1, 'El proceso es requerido'),
  speedMh: z.number().optional().nullable(),
  speedKgh: z.number().optional().nullable(),
  circumferenceTotal: z.number().optional().nullable(),
  maxWidth: z.number().optional().nullable(),
  maxCenter: z.number().optional().nullable(),
  status: z.string().max(50).optional().nullable()
});

export type MachineDto = z.infer<typeof machineSchema>;
