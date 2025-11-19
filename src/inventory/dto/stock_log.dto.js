import { z } from "zod";

// ✅ Common UUID validation
const uuidSchema = z.string().uuid({ message: "Must be a valid UUID" });

// ✅ Enum for transaction type (must match Sequelize ENUM)
const transactionTypeEnum = z.enum(["IN", "OUT"], {
  required_error: "Transaction type is required",
});

// ✅ Create Stock Log Schema
export const createStockLogSchema = z.object({
  item_id: uuidSchema, // Foreign key (InventoryItem)
  transaction_type: transactionTypeEnum,
  quantity: z
    .number()
    .int({ message: "Quantity must be an integer" })
    .positive({ message: "Quantity must be greater than 0" }),
  room_id: uuidSchema.optional(), // Optional — only for issued items
  remarks: z.string().max(500).optional(),
  issued_by: uuidSchema.optional(),
  transaction_date: z.string().datetime().optional(), // Optional (default: now)
});

// ✅ Update Stock Log Schema
export const updateStockLogSchema = z.object({
  id: uuidSchema, // Required for identifying the record
  item_id: uuidSchema.optional(),
  transaction_type: transactionTypeEnum.optional(),
  quantity: z
    .number()
    .int()
    .positive()
    .optional(),
  room_id: uuidSchema.optional(),
  remarks: z.string().max(500).optional(),
  issued_by: uuidSchema.optional(),
  transaction_date: z.string().datetime().optional(),
});
