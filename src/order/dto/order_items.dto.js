
import { z } from "zod";

// ✅ Base order item schema (adjusted to use meal_item_id)
export const orderItemSchema = z.object({
  order_id: z.string({ required_error: "Order ID is required" }).uuid(),
  meal_item_id: z.string({ required_error: "Meal Item ID is required" }).uuid(), // Corrected to meal_item_id
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  price: z
    .number()
    .min(0, "Price must be a positive value"), // Price should be a number, not string
  special_request: z.string().max(255).optional(),
});

// ✅ Create order item schema (extends base schema with specific validations)
export const createOrderItemSchema = orderItemSchema.extend({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  price: z
    .number()
    .min(0, "Price must be a positive value"), 
  special_request: z.string().max(255).optional(),
});

// ✅ Update order item schema (for updating fields like quantity, price, special_request)
export const updateOrderItemSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1").optional(),
  price: z
    .number()
    .min(0, "Price must be a positive value")
    .optional(), // Making price optional for updates
  special_request: z.string().max(255).optional(),
});

// ✅ Delete (soft delete) schema (track who deletes)
export const deleteOrderItemSchema = z.object({
  deleted_by: z.string().uuid().optional(),
});

// ✅ Query schema for filtering order items (for GET /order_items)
export const getOrderItemsQuerySchema = z.object({
  order_id: z.string().uuid().optional(),
  meal_item_id: z.string().uuid().optional(), // Corrected to meal_item_id
  status: z
    .enum(["Pending", "Preparing", "Ready", "Served", "Cancelled"])
    .optional(),
});
