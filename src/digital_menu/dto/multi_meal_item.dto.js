// src/dto/multiMealItem.validation.js
import { z } from "zod";

// Base schema for MultiMealItem
export const multiMealItemSchema = z.object({
  id: z.string().uuid().optional(),
  multi_meal_id: z.string().uuid({ message: "multi_meal_id must be a valid UUID" }),
  meal_item_id: z.string().uuid({ message: "meal_item_id must be a valid UUID" }),
  course_order: z.number().int().min(1, "course_order must be at least 1").optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  deleted_at: z.date().nullable().optional(),
});

// ✅ Schema for creating a new MultiMealItem
export const createMultiMealItemSchema = z.object({
  multi_meal_id: z.string().uuid({ message: "multi_meal_id must be a valid UUID" }),
  meal_item_id: z.string().uuid({ message: "meal_item_id must be a valid UUID" }),
  course_order: z.number().int().min(1, "course_order must be at least 1").optional(),
});

// ✅ Schema for updating a MultiMealItem
export const updateMultiMealItemSchema = z.object({
  multi_meal_id: z.string().uuid().optional(),
  meal_item_id: z.string().uuid().optional(),
  course_order: z.number().int().min(1, "course_order must be at least 1").optional(),
});

// ✅ Schema for soft deleting (if you support soft deletes)
export const deleteMultiMealItemSchema = z.object({
  deleted_at: z.date().optional(),
});
