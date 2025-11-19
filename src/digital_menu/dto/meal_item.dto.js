// src/dto/mealItem.validation.js
import { z } from 'zod';

// Schema for MealItem data
export const mealItemSchema = z.object({
  id: z.string().uuid().optional(),
  cuisine_id: z.string().uuid(),
  meal_type_id: z.string().uuid(),
  course_type: z.enum(["veg", "non-veg"]),
  description: z.string().max(500, 'Description should not exceed 500 characters').optional(),
  duration: z.number().min(1, 'Duration should be at least 1 minute').optional(),
  price: z.number().min(0, 'Price should be a positive number').optional(),
  image: z.string().max(1000, 'Image URL should not exceed 1000 characters').optional(),
  is_active: z.boolean().optional(),
  created_by: z.string().uuid().optional(),
  updated_by: z.string().uuid().optional(),
  deleted_by: z.string().uuid().optional(),
});

// Schema for creating a new meal item
export const createMealItemSchema = z.object({
  cuisine_id: z.string().uuid(),
  meal_type_id: z.string().uuid(),
  course_type: z.enum(['veg', 'non-veg']),
  description: z.string().max(500, 'Description should not exceed 500 characters').optional(),
  duration: z.number().min(1, 'Duration should be at least 1 minute').optional(),
  price: z.number().min(0, 'Price should be a positive number').optional(),
  image: z.string().max(1000, 'Image URL should not exceed 1000 characters').optional(),
  is_active: z.boolean().optional(),
  created_by: z.string().uuid().optional(),
});

// Schema for updating an existing meal item
export const updateMealItemSchema = z.object({
  cuisine_id: z.string().uuid().optional(),
  meal_type_id: z.string().uuid().optional(), 
  course_type: z.enum(['veg', 'non-veg']).optional(),
  description: z.string().max(500, 'Description should not exceed 500 characters').optional(),
  duration: z.number().min(1, 'Duration should be at least 1 minute').optional(),
  price: z.number().min(0, 'Price should be a positive number').optional(),
  image: z.string().max(1000, 'Image URL should not exceed 1000 characters').optional(),
  is_active: z.boolean().optional(),
  updated_by: z.string().uuid().optional(),
});

// Schema for soft deleting a meal item (by updating `is_active` to false)
export const deleteMealItemSchema = z.object({
  deleted_by: z.string().uuid().optional(),
});
