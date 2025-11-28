import { z } from 'zod';

import { ModeAction } from '@/config/enums/mode-action.enum';

export const baseWarehouseSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  type: z.string().min(1, 'El tipo es requerido'),
  active: z.boolean()
});

const createWarehouseSchema = baseWarehouseSchema.extend({
  mode: z.literal(ModeAction.Create)
});

const updateWarehouseSchema = baseWarehouseSchema.extend({
  id: z.number(),
  mode: z.enum([ModeAction.Edit, ModeAction.Show])
});

export const warehouseSchema = z.discriminatedUnion('mode', [
  createWarehouseSchema,
  updateWarehouseSchema
]);

export type WarehouseDto = z.infer<typeof warehouseSchema>;

export const baseWarehouseLocationSchema = z.object({
  warehouse_id: z.number().positive('Debe seleccionar un almacén'),
  aisle: z.string().max(50).nullable().optional(),
  shelf: z.string().max(50).nullable().optional(),
  section: z.string().max(50).nullable().optional()
});

const createWarehouseLocationSchema = baseWarehouseLocationSchema.extend({
  mode: z.literal(ModeAction.Create)
});

const updateWarehouseLocationSchema = baseWarehouseLocationSchema.extend({
  id: z.number(),
  mode: z.enum([ModeAction.Edit, ModeAction.Show])
});

export const warehouseLocationSchema = z.discriminatedUnion('mode', [
  createWarehouseLocationSchema,
  updateWarehouseLocationSchema
]);

export type WarehouseLocationDto = z.infer<typeof warehouseLocationSchema>;
