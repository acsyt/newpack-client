import { z } from 'zod';

import { ModeAction } from '@/config/enums/mode-action.enum';

const baseSchema = z.object({
  name: z
    .string({
      required_error: 'El campo nombre es requerido para rol.'
    })
    .min(3, {
      message: 'El campo nombre debe tener al menos 3 caracteres.'
    })
    .max(255, {
      message: 'El campo nombre debe tener como máximo 255 caracteres.'
    }),
  active: z.boolean(),
  permissions: z.array(
    z
      .string({
        required_error: 'Las permisos son requeridas.'
      })
      .min(3, {
        message: 'El campo permisos debe tener al menos 3 caracteres.'
      })
      .max(255, {
        message: 'El campo permisos debe tener como máximo 255 caracteres.'
      })
  )
});

const createSchema = baseSchema.extend({
  mode: z.literal(ModeAction.Create)
});

const updateSchema = baseSchema.extend({
  id: z.number().positive(),
  mode: z.enum([ModeAction.Edit, ModeAction.Show])
});

export const roleSchema = z.discriminatedUnion('mode', [
  createSchema,
  updateSchema
]);

export type RoleDto = z.infer<typeof roleSchema>;
