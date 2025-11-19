import { z } from "zod";

export const categorySchema = z.object({
  item_name: z.string().min(1, "Item name is required"),

  // ⭐ image is optional (Multipart upload)
  image: z.string().optional(),

  description: z.string().min(1, "Description is required"),

  price: z.coerce.number().min(0, "Price must be >= 0"),

  meal_type: z
    .string()
    .transform(val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase())
    .refine(val => ["Breakfast", "Lunch", "Dinner", "Snack"].includes(val), {
      message: "Invalid meal type",
    }),

  cuisine: z.string().min(1, "Cuisine is required"),

  tax_percentage: z.coerce.number().min(0).max(100).default(0),

  preparation_time: z.coerce.number().min(1, "Preparation time must be >= 1"),

  is_available: z.coerce.boolean().default(true),
  is_multi_course: z.coerce.boolean().default(false),
  is_active: z.coerce.boolean().default(true),

  updated_by: z.string().uuid().optional(),
});

export const updateCategorySchema = categorySchema.partial();
