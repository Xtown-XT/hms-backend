// import { z } from 'zod';

// export const createBillSchema = z.object({
//   order_id: z.string().uuid(),
// });



import { z } from "zod";

// Common UUID validator
const uuidSchema = z.string().uuid({ message: "Must be a valid UUID" });

// ✅ Create Bill Schema
export const createBillSchema = z.object({
  order_id: uuidSchema,
  room_id: uuidSchema,
  total_amount: z
    .number({ required_error: "Total amount is required" })
    .positive("Total amount must be greater than 0"),
  payment_status: z
    .enum(["unpaid", "paid"])
    .default("unpaid")
    .optional(),
  is_active: z.boolean().optional(),
  createdBy: uuidSchema.optional(),
});

// ✅ Update Bill Schema
export const updateBillSchema = z.object({
  total_amount: z.number().positive().optional(),
  payment_status: z.enum(["unpaid", "paid"]).optional(),
  is_active: z.boolean().optional(),
  updatedBy: uuidSchema.optional(),
});
