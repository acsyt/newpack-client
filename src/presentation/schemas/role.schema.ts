import { z } from 'zod';

import { ModeAction } from '@/config/enums/mode-action.enum';

const baseSchema = z.object({
  name: z
    .string({
      required_error: 'Name is a required field'
    })
    .min(3, {
      message: 'Name must be at least 3 characters long'
    })
    .max(255, {
      message: 'Name cannot be longer than 255 characters'
    }),
  permissions: z
    .array(
      z
        .string({
          required_error: 'At least one permission must be selected'
        })
        .min(3, {
          message: 'Each permission must be at least 3 characters long'
        })
        .max(255, {
          message: 'Each permission cannot be longer than 255 characters'
        })
    )
    .min(1, {
      message: 'At least one permission must be selected'
    }),
  active: z.boolean().default(true)
});

const createSchema = baseSchema.extend({
  mode: z.literal(ModeAction.Create)
});

const updateSchema = baseSchema.extend({
  mode: z.enum([ModeAction.Edit, ModeAction.Show]),
  id: z.number().positive()
});

export const roleSchema = z.discriminatedUnion('mode', [
  createSchema,
  updateSchema
]);
export type RoleDto = z.infer<typeof roleSchema>;
