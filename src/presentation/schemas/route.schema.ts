import { z } from 'zod';

export const routeIdSchema = z
  .string()
  .transform(Number)
  .pipe(z.number().int().positive());
