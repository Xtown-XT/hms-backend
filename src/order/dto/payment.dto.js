import { z } from "zod";

// Create Payment
export const createPaymentSchema = z.object({
  order_id: z.string().uuid().optional(),
  bill_id: z.string().uuid().optional(),
  bill_amount: z.number(),
  amount_received: z.number(),
  // balance: z.number(),
  status: z.enum(["PENDING", "SUCCESS", "FAILED"]).optional(),
  method: z.enum(["CASH", "CARD", "UPI"]).optional(),
  created_by: z.string().uuid().optional(),
});

// Update Payment
export const updatePaymentSchema = z.object({
  bill_amount: z.number().optional(),
  method: z.enum(["CASH", "CARD", "UPI"]).optional(),
  transactionId: z.string().optional(),
  updated_by: z.string().uuid().optional(),
});

// Get Payments query (filters)
export const getPaymentsQuerySchema = z.object({
  includeInactive: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  orderBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

// Payment ID param
export const paymentIdParamSchema = z.object({
  id: z.string().uuid(),
});
