
import { z } from "zod";

export const orderSchema = z.object({
  guest_id: z.string({ required_error: "Guest ID is required" }).uuid(),
  room_id: z.string({ required_error: "Room ID is required" }).uuid(),
  total_amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Total amount must be a valid decimal value"),
  status: z
    .enum([
      "Pending",
      "Confirmed",
      "Preparing",
      "Ready",
      "Delivered",
      "Cancelled",
    ])
    .optional(),
  payment_status: z.enum(["Unpaid", "Paid", "Failed"]).optional(),
  created_by: z.string().uuid().optional(),
  updated_by: z.string().uuid().optional(),
  deleted_by: z.string().uuid().optional(),
});

// ✅ Create order schema
export const createOrderSchema = orderSchema.extend({
  status: z
    .enum([
      "Pending",
      "Confirmed",
      "Preparing",
      "Ready",
      "Delivered",
      "Cancelled",
    ])
    .default("Pending"),
  payment_status: z.enum(["Unpaid", "Paid", "Failed"]).default("Unpaid"),
  created_by: z.string().uuid().optional(),
});

// ✅ Update order schema
export const updateOrderSchema = z.object({
  total_amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Total amount must be a valid decimal value")
    .optional(),
  status: z
    .enum([
      "Pending",
      "Confirmed",
      "Preparing",
      "Ready",
      "Delivered",
      "Cancelled",
    ])
    .optional(),
  payment_status: z.enum(["Unpaid", "Paid", "Failed"]).optional(),
  updated_by: z.string().uuid().optional(),
});

// ✅ Delete (soft delete) schema
export const deleteOrderSchema = z.object({
  deleted_by: z.string().uuid().optional(),
});

// ✅ Optional: Query schema for filtering orders (for GET /orders)
export const getOrdersQuerySchema = z.object({
  status: z
    .enum([
      "Pending",
      "Confirmed",
      "Preparing",
      "Ready",
      "Delivered",
      "Cancelled",
    ])
    .optional(),
  payment_status: z.enum(["Unpaid", "Paid", "Failed"]).optional(),
  room_id: z.string().uuid().optional(),
  guest_id: z.string().uuid().optional(),
});
