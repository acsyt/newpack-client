import { z } from 'zod';

import { ModeAction } from '@/config/enums/mode-action.enum';

const baseSchema = z.object({
  // role_id: z.number({
  //   required_error: 'Role is a required field'
  // }),
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
    .max(50, {
      message: 'El nombre no puede tener más de 50 caracteres'
    })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, {
      message:
        'El nombre solo puede contener letras, espacios, apóstrofes y guiones'
    })
    .refine(
      name =>
        !name.startsWith("'") && !name.startsWith('-') && !name.startsWith('.'),
      {
        message: 'El nombre no puede empezar con comilla simple, guion o punto'
      }
    )
    .refine(
      name => !name.endsWith("'") && !name.endsWith('-') && !name.endsWith('.'),
      {
        message: 'El nombre no puede terminar con comilla simple, guion o punto'
      }
    )
    .refine(name => !name.includes('  '), {
      message: 'El nombre no puede contener múltiples espacios consecutivos'
    }),
  last_name: z
    .string({
      required_error: 'El apellido es un campo requerido'
    })
    .min(2, {
      message: 'El apellido debe tener al menos 2 caracteres'
    })
    .max(50, {
      message: 'El apellido no puede tener más de 50 caracteres'
    })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, {
      message:
        'El apellido solo puede contener letras, espacios, apóstrofes y guiones'
    })
    .refine(
      lastName =>
        !lastName.startsWith("'") &&
        !lastName.startsWith('-') &&
        !lastName.startsWith('.'),
      {
        message:
          'El apellido no puede empezar con comilla simple, guion o punto'
      }
    )
    .refine(
      lastName =>
        !lastName.endsWith("'") &&
        !lastName.endsWith('-') &&
        !lastName.endsWith('.'),
      {
        message:
          'El apellido no puede terminar con comilla simple, guion o punto'
      }
    )
    .refine(lastName => !lastName.includes('  '), {
      message: 'El apellido no puede contener múltiples espacios consecutivos'
    }),
  email: z
    .string({
      required_error: 'El correo electrónico es un campo requerido'
    })
    .email({
      message: 'Por favor, ingrese una dirección de correo electrónico válida'
    })
});

const createSchema = z.object({
  ...baseSchema.shape,
  mode: z.literal(ModeAction.Create)
});

const updateSchema = z.object({
  ...baseSchema.shape,
  mode: z.enum([ModeAction.Edit, ModeAction.Show])
});

export const userSchema = z.discriminatedUnion('mode', [
  createSchema,
  updateSchema
]);

export type UserDto = z.infer<typeof userSchema>;
