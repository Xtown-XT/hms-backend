import { z } from "zod";

// ✅ Common UUID validation
const uuidSchema = z.string().uuid({ message: "Must be a valid UUID" });

// ✅ Enum for delivery status
const statusEnum = z.enum([
  "PENDING",
  "READY",
  "CHECKED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);

// ✅ Create Delivery Log Schema
export const createDeliveryLogSchema = z.object({
  order_id: uuidSchema,
  room_id: uuidSchema,
  status: statusEnum.optional().default("PENDING"),
  item_check: z.boolean().optional().default(false),
});

// ✅ Update Delivery Log Schema
export const updateDeliveryLogSchema = z.object({
  delivery_id: uuidSchema, 
  status: statusEnum.optional(),
  item_check: z.boolean().optional(),
});

// ✅ Optional: status-only update (for quick status transitions)
export const updateDeliveryStatusSchema = z.object({
  delivery_id: uuidSchema,
  status: statusEnum,
});
