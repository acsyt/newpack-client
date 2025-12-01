import { ModeAction } from '@/config/enums/mode-action.enum';
import { z } from 'zod';

export const baseSchema = z.object({
  company_name: z.string().min(1, "El nombre de la empresa es obligatorio"),
  contact_name: z.string().min(1, "El nombre del contacto es obligatorio"),
  email: z.string().email("Correo electrónico no válido"),
  phone: z.string().regex(/^\d{10}$/, "Teléfono debe tener 10 dígitos"),
  phone_secondary: z.string().regex(/^\d{10}$/, "Teléfono secundario debe tener 10 dígitos").optional(),
  suburb_id: z.number().int("El suburb_id debe ser un número entero"),
  street: z.string().min(1, "La calle es obligatoria"),
  exterior_number: z.string().min(1, "El número exterior es obligatorio"),
  interior_number: z.string().optional(),
  address_reference: z.string().optional(),
  rfc: z.string().regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, "RFC inválido"),
  legal_name: z.string().min(1, "La razón social es obligatoria"),
  tax_system: z.string().min(1, "El régimen fiscal es obligatorio"),
  status: z.string(),
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

export const supplierSchema = z.discriminatedUnion('mode', [
  createSchema,
  updateSchema
]);

export type SupplierDto = z.infer<typeof supplierSchema>;