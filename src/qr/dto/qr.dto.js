import { z } from "zod";

// Create QR
export const createQrSchema = z.object({
  table: z.string(),
  created_by: z.string().optional(),
});

// Update QR
export const updateQrSchema = z.object({
  table: z.string().optional(),
  updated_by: z.string().optional(),
});

// Get QRs query (filters)
export const getQrsQuerySchema = z.object({
  includeInactive: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  orderBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

// QR ID param
export const qrIdParamSchema = z.object({
  id: z.string(),
});
