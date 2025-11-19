import { z } from 'zod';

// Schema for Cuisine data
export const cuisineSchema = z.object({
  cuisine_type: z.enum(['italian', 'chinese', 'indian', 'mexican', 'french', 'japanese', 'thai', 'vietnamese', 'korean']),
  description: z.string().max(200, 'Description should not exceed 200 characters').optional(),
  is_active: z.boolean().optional(),
  created_by: z.string().uuid().optional(),
  updated_by: z.string().uuid().optional(),
  deleted_by: z.string().uuid().optional(),
});

// Schema for creating a new cuisine
export const createCuisineSchema = z.object({
  cuisine_type: z.enum(['italian', 'chinese', 'indian', 'mexican', 'french', 'japanese', 'thai', 'vietnamese', 'korean']),
  description: z.string().max(200, 'Description should not exceed 200 characters').optional(),
  is_active: z.boolean().optional(),
  created_by: z.string().uuid().optional(),
});

// Schema for updating an existing cuisine
export const updateCuisineSchema = z.object({
  cuisine_type: z.enum(['italian', 'chinese', 'indian', 'mexican', 'french', 'japanese', 'thai', 'vietnamese', 'korean']).optional(),
  description: z.string().max(200, 'Description should not exceed 200 characters').optional(),
  is_active: z.boolean().optional(),
  updated_by: z.string().uuid().optional(),
});

// Schema for soft deleting a cuisine (by updating `is_active` to false)
export const deleteCuisineSchema = z.object({
  deleted_by: z.string().uuid().optional(),
});
