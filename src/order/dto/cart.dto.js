import { z } from "zod";

// ✅ Create Cart DTO
export const createCartSchema = z.object({
  guest_id: z.string({ required_error: "Guest ID is required" }).uuid(),
  room_id: z.string({ required_error: "Room ID is required" }).uuid(),
  meal_item_id: z.string({ required_error: "Meal Item ID is required" }).uuid(), 
  quantity: z
    .number({ required_error: "Quantity is required" })
    .int()
    .min(1, "Quantity must be at least 1"),
  price: z
    .number()
    .min(0, "Price must be a positive value")
    .optional(), 
  special_request: z
    .string()
    .max(255, "Special request must not exceed 255 characters")
    .optional(), 
  status: z.enum(["Active", "CheckedOut", "Cancel"]).default("Active"),
  is_active: z.boolean().default(true), 
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// ✅ Update Cart DTO
export const updateCartSchema = z.object({
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .optional(),
  price: z
    .number()
    .min(0, "Price must be a positive value")
    .optional(), 
  special_request: z
    .string()
    .max(255, "Special request must not exceed 255 characters")
    .optional(),
  status: z.enum(["Active", "CheckedOut", "Cancel"]).optional(),
  is_active: z.boolean().optional(),
  updated_at: z.string().optional(),
});

// ✅ Delete Cart DTO (soft delete)
export const deleteCartSchema = z.object({
  deleted_by: z.string().uuid().optional(),
});

// ✅ Query DTO for filtering Cart records
export const getCartsQuerySchema = z.object({
  status: z.enum(["Active", "CheckedOut", "Cancel"]).optional(),
  guest_id: z.string().uuid().optional(),
  room_id: z.string().uuid().optional(),
  meal_item_id: z.string().uuid().optional(), // Updated to UUID
});
