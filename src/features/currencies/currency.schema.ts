import { z } from 'zod';

import { ModeAction } from '@/config/enums/mode-action.enum';

const baseSchema = z.object({
  active: z.boolean({
    required_error: 'El estado activo es un campo requerido'
  }),
  name: z
    .string({
      required_error: 'El nombre es un campo requerido'
    })
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres'
    })
    .max(255, {
      message: 'El nombre no puede tener más de 255 caracteres'
    }),
  code: z
    .string({
      required_error: 'El código es un campo requerido'
    })
    .min(2, {
      message: 'El código debe tener al menos 2 caracteres'
    })
    .max(10, {
      message: 'El código no puede tener más de 10 caracteres'
    })
    .toUpperCase()
});

const createSchema = z.object({
  ...baseSchema.shape,
  mode: z.literal(ModeAction.Create)
});

const updateSchema = z.object({
  ...baseSchema.shape,
  mode: z.enum([ModeAction.Edit, ModeAction.Show])
});

export const currencySchema = z.discriminatedUnion('mode', [
  createSchema,
  updateSchema
]);

export type CurrencyDto = z.infer<typeof currencySchema>;
