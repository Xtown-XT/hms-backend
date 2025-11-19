
// import { z } from 'zod';

// // Schema for a single order item
// export const orderItemSchema = z.object({
//   item_name: z.string().min(1, 'Item name is required'),
//   quantity: z.number().int().positive('Quantity must be a positive integer').default(1),
//   price: z.number().positive('Price must be a positive number'),
//   is_active: z.boolean().optional(),
// });

// // Schema for creating a new order
// export const createOrderSchema = z.object({
//   order_code: z.string().min(1, 'Order code is required'),
//   order_type: z.enum(['dine-in', 'takeaway']),
//   table_no: z.number().int().positive('Table number must be positive'),
//   status: z.enum(['pending', 'ready', 'served', 'completed']).optional(),
//   view: z.boolean().optional(),
//   view_time: z.date().optional(),
//   is_active: z.boolean().optional(),
//   createdBy: z.string().uuid().optional(),
//   updatedBy: z.string().uuid().optional(),
//   items: z.array(orderItemSchema).optional(),
// });

// // Schema for updating order status
// export const updateOrderStatusSchema = z.object({
//   status: z.enum(['pending', 'ready', 'served', 'completed']),
// });

// // Schema for adding an item to an existing order
// export const addOrderItemSchema = orderItemSchema;









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
