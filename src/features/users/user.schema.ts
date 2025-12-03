import { z } from "zod";
import { matchIsValidTel } from "mui-tel-input";
import { ModeAction } from "@/config/enums/mode-action.enum";


const baseSchema = z.object({
  active: z.boolean({
    required_error: "El estado activo es un campo requerido",
  }),
  name: z
    .string({ required_error: "El nombre es un campo requerido" })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, {
      message:
        "El nombre solo puede contener letras, espacios, apóstrofes y guiones",
    })
    .refine(
      (name) =>
        !name.startsWith("'") && !name.startsWith("-") && !name.startsWith("."),
      {
        message: "El nombre no puede empezar con comilla simple, guion o punto",
      }
    )
    .refine(
      (name) => !name.endsWith("'") && !name.endsWith("-") && !name.endsWith("."),
      {
        message: "El nombre no puede terminar con comilla simple, guion o punto",
      }
    )
    .refine((name) => !name.includes("  "), {
      message: "El nombre no puede contener múltiples espacios consecutivos",
    }),
  last_name: z
    .string({ required_error: "El apellido es un campo requerido" })
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(50, { message: "El apellido no puede tener más de 50 caracteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, {
      message:
        "El apellido solo puede contener letras, espacios, apóstrofes y guiones",
    }),
  email: z
    .string({ required_error: "El correo electrónico es un campo requerido" })
    .email({ message: "Por favor, ingrese un correo válido" }),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || matchIsValidTel(value), {
      message: "El número telefónico no es válido",
    }),
  role_id: z.number().optional(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .refine(
      (value) =>
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[^A-Za-z0-9]/.test(value),
      {
        message:
          "La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales",
      }
    )
    .optional(),
  password_confirmation: z.string().optional(),
  immediate_supervisor_id: z.number().optional(),
});

const createSchema = baseSchema
  .extend({
    password: z
      .string({ required_error: "La contraseña es requerida" })
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .refine(
        (value) =>
          /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[^A-Za-z0-9]/.test(value),
        {
          message:
            "La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales",
        }
      ),
    password_confirmation: z.string({
      required_error: "La confirmación de contraseña es requerida",
    }),
    mode: z.literal(ModeAction.Create),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

const updateSchema = baseSchema
  .extend({
    mode: z.union([z.literal(ModeAction.Edit), z.literal(ModeAction.Show)]),
  })
  .refine(
    (data) =>
      !data.password || !data.password_confirmation || (data.password === data.password_confirmation),
    {
      message: "Las contraseñas no coinciden",
      path: ["password_confirmation"],
    }
  );

export const userSchema = z.union([createSchema, updateSchema]);

export type UserDto = z.infer<typeof userSchema>;
