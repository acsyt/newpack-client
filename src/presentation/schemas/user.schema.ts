import { matchIsValidTel } from 'mui-tel-input';
import { z } from 'zod';

import { ModeAction } from '@/config/enums/mode-action.enum';

const baseSchema = z.object({
  phone: z
    .string()
    .optional()
    .refine(v => !v || matchIsValidTel(v), {
      message: 'Invalid phone number'
    }),
  role_id: z.number({
    required_error: 'Role is a required field'
  }),
  active: z.boolean({
    required_error: 'Active status is a required field'
  }),
  username: z
    .string({
      required_error: 'Username is a required field'
    })
    .min(3, {
      message: 'Username must be at least 3 characters long'
    })
    .max(30, {
      message: 'Username cannot be longer than 30 characters'
    })
    .regex(/^[a-zA-Z0-9_.-]+$/, {
      message:
        'Username can only contain letters, numbers, periods, underscores, and hyphens'
    })
    .transform(value => value.toLowerCase()),
  name: z
    .string({
      required_error: 'Name is a required field'
    })
    .min(2, {
      message: 'Name must be at least 2 characters long'
    })
    .max(50, {
      message: 'Name cannot be longer than 50 characters'
    })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, {
      message: 'Name can only contain letters, spaces, apostrophes, and hyphens'
    })
    .refine(
      name =>
        !name.startsWith("'") && !name.startsWith('-') && !name.startsWith('.'),
      {
        message: 'Name cannot start with a single quote, hyphen, or period'
      }
    )
    .refine(
      name => !name.endsWith("'") && !name.endsWith('-') && !name.endsWith('.'),
      {
        message: 'Name cannot end with a single quote, hyphen, or period'
      }
    )
    .refine(name => !name.includes('  '), {
      message: 'Name cannot contain multiple consecutive spaces'
    }),
  email: z
    .string({
      required_error: 'Email is a required field'
    })
    .email({
      message: 'Please enter a valid email address'
    })
});

const createSchema = z.object({
  ...baseSchema.shape,
  mode: z.literal(ModeAction.Create)
});

const updateSchema = z.object({
  ...baseSchema.shape,
  mode: z.enum([ModeAction.Edit, ModeAction.Show]),
  id: z.number().positive()
});

export const userSchema = z.discriminatedUnion('mode', [
  createSchema,
  updateSchema
]);

export type UserDto = z.infer<typeof userSchema>;
