import { z } from 'zod';

// CREATE MultiCourseMeal
export const createMultiCourseMealSchema = z.object({
  body: z.object({
    meal_name: z.string().min(1, "Meal name is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    menu_item_id: z.string().uuid("menu_item_id must be a valid UUID"),
    duration: z.number().positive("Duration must be positive"),
    image: z.string().optional(), // store filename or path
  }),
});

// UPDATE MultiCourseMeal
export const updateMultiCourseMealSchema = z.object({
  body: z.object({
    meal_name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    menu_item_id: z.string().uuid().optional(),
    duration: z.number().positive().optional(),
    image: z.string().optional(),
  }),
});

// PATCH Restore can optionally have updates
export const restoreMultiCourseMealSchema = z.object({
  body: z.object({
    meal_name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    menu_item_id: z.string().uuid().optional(),
    duration: z.number().positive().optional(),
    image: z.string().optional(),
  }).optional(),
});
