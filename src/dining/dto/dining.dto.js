
import { z } from 'zod';

export const createDiningTableSchema = z.object({
  table_number: z.string().min(1,"Table Number is Required"),
  created_by: z.string().uuid().optional()
});

export const updateDiningTableSchema = z.object({
  table_number: z.string().optional(),
  updated_by: z.string().uuid().optional()
});
