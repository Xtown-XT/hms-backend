import { z } from 'zod';

// Schema for MealType data
export const mealTypeSchema = z.object({
  meal_type: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert']),
  description: z.string().max(200, 'Description should not exceed 200 characters').optional(),
  is_active: z.boolean().optional(),
  created_by: z.string().uuid().optional(),
  updated_by: z.string().uuid().optional(),
  deleted_by: z.string().uuid().optional(),
});

// Schema for creating a new meal type
export const createMealTypeSchema = z.object({
  meal_type: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert']),
  description: z.string().max(200, 'Description should not exceed 200 characters').optional(),
  is_active: z.boolean().optional(),
  created_by: z.string().uuid().optional(),
});

// Schema for updating an existing meal type
export const updateMealTypeSchema = z.object({
  meal_type: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert']).optional(),
  description: z.string().max(200, 'Description should not exceed 200 characters').optional(),
  is_active: z.boolean().optional(),
  updated_by: z.string().uuid().optional(),
});

// Schema for soft deleting a meal type (by updating `is_active` to false)
export const deleteMealTypeSchema = z.object({
  deleted_by: z.string().uuid().optional(),
});
