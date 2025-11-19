import { z } from "zod";

// ✅ Common UUID validation
const uuidSchema = z.string().uuid({ message: "Must be a valid UUID" });

// ✅ Enum definitions (must match your Sequelize ENUMs)
const itemNameEnum = z.enum([
  "Bath Towel",
  "Shampoo Bottle",
  "Pillow Cover",
  "Detergent",
  "Soap",
  "Air Freshener",
  "Cleaning Cloth",
  "Toilet Paper",
]);

const categoryEnum = z.enum(["Linen", "Toiletries", "Cleaning Supplies"]);

// ✅ Create Inventory Item Schema
export const createInventoryItemSchema = z.object({
  item_name: itemNameEnum,
  category: categoryEnum,
  unit: z.string().max(20).default("pcs"),
  quantity_in_stock: z.number().int().nonnegative().default(0),
  reorder_level: z.number().int().min(1).default(5),
  purchase_price: z.number().positive().optional(),
  is_active: z.boolean().default(true),
  created_by: uuidSchema.optional(),
});

// ✅ Update Inventory Item Schema
export const updateInventoryItemSchema = z.object({
  id: uuidSchema,
  item_name: itemNameEnum.optional(),
  category: categoryEnum.optional(),
  unit: z.string().max(20).optional(),
  quantity_in_stock: z.number().int().nonnegative().optional(),
  reorder_level: z.number().int().min(1).optional(),
  purchase_price: z.number().positive().optional(),
  is_active: z.boolean().optional(),
  updated_by: uuidSchema.optional(),
});
