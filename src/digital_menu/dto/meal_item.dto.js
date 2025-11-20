import { z } from 'zod';

// Base schema
export const mealItemSchema = z.object({
  id: z.string().uuid().optional(),

  cuisine_id: z.string().uuid(),
  meal_type_id: z.string().uuid(),
  course_type: z.enum(["veg", "non-veg"]),

  description: z.string().max(500).optional(),

  duration: z.coerce.number()
    .min(1, "Duration should be at least 1 minute")
    .optional(),

  price: z.coerce.number()
    .min(0, "Price should be a positive number")
    .optional(),

  image: z.string().optional(),
  is_active: z.boolean().optional(),
  created_by: z.string().uuid().optional(),
  updated_by: z.string().uuid().optional(),
  deleted_by: z.string().uuid().optional(),
});

// Create schema
export const createMealItemSchema = z.object({
  cuisine_id: z.string().uuid(),
  meal_type_id: z.string().uuid(),
  course_type: z.enum(["veg", "non-veg"]),

  description: z.string().max(500).optional(),

  duration: z.coerce.number()
    .min(1, "Duration should be at least 1 minute"),

  price: z.coerce.number()
    .min(1, "Price should be greater than 0"),

  image: z.string().optional(),
  is_active: z.boolean().optional(),
  created_by: z.string().uuid().optional(),
});

// Update schema
export const updateMealItemSchema = z.object({
  cuisine_id: z.string().uuid().optional(),
  meal_type_id: z.string().uuid().optional(),
  course_type: z.enum(["veg", "non-veg"]).optional(),

  description: z.string().max(500).optional(),

  duration: z.coerce.number()
    .min(1, "Duration should be at least 1 minute")
    .optional(),

  price: z.coerce.number()
    .min(0, "Price should be a positive number")
    .optional(),

  image: z.string().optional(),
  is_active: z.boolean().optional(),
  updated_by: z.string().uuid().optional(),
});

// Delete schema
export const deleteMealItemSchema = z.object({
  deleted_by: z.string().uuid().optional(),
});
