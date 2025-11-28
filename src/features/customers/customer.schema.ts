import { ModeAction } from '@/config/enums/mode-action.enum';
import { z } from 'zod';

export const baseSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    last_name: z.string().min(1, "El apellido es obligatorio"),
    email: z.string().email("Correo electrónico no válido"),
    phone: z.string().regex(/^\d{10}$/, "Teléfono debe tener 10 dígitos"),
    phone_secondary: z.string().regex(/^\d{10}$/, "Teléfono secundario debe tener 10 dígitos").optional(),
    suburb_id: z.number(),
    street: z.string().min(1, "La calle es obligatoria"),
    exterior_number: z.string().min(1, "El número exterior es obligatorio"),
    interior_number: z.string().optional(),
    address_reference: z.string().optional(),
    rfc: z.string().regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i, "Formato de RFC no válido"),
    legal_name: z.string().min(1, "La razón social es obligatoria"),
    // taxSystem: z.string().min(1, "El régimen fiscal es obligatorio"),
    // cfdiUse: z.string().min(1, "El uso de CFDI es obligatorio"),
    status: z.string(),
    // client_type: z.string(),
    notes: z.string().optional(),
});

const createSchema = z.object({
    ...baseSchema.shape,
    mode: z.literal(ModeAction.Create)
});

const updateSchema = z.object({
  ...baseSchema.shape,
  mode: z.enum([ModeAction.Edit, ModeAction.Show])
});

export const customerSchema = z.discriminatedUnion('mode', [
    createSchema,
    updateSchema
]);

export type CustomerDto = z.infer<typeof customerSchema>;