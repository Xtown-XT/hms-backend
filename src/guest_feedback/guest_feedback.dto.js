// src/modules/guest_feedback/guest_feedback.validation.js
import { z } from "zod";

const uuidSchema = z.string().uuid({ message: "Must be a valid UUID" });

const ratingEnum = z.enum(["Excellent", "Good", "Average", "Poor"]);

// Create Feedback
export const createGuestFeedbackSchema = z.object({
  guest_id: uuidSchema,
  room_id: uuidSchema,

  check_in_date: z.string().date(),
  check_out_date: z.string().date(),

  // Service Quality
  front_desk_assistance: ratingEnum.optional(),
  housekeeping_service: ratingEnum.optional(),
  restaurant_dining_experience: ratingEnum.optional(),

  // Room & Facilities
  cleanliness: ratingEnum.optional(),
  amenities: ratingEnum.optional(),
  pool_fitness_center: ratingEnum.optional(),

  is_active: z.boolean().optional(),
});

// Update Feedback
export const updateGuestFeedbackSchema = z.object({
  feedback_id: uuidSchema,

  check_in_date: z.string().date().optional(),
  check_out_date: z.string().date().optional(),

  front_desk_assistance: ratingEnum.optional(),
  housekeeping_service: ratingEnum.optional(),
  restaurant_dining_experience: ratingEnum.optional(),

  cleanliness: ratingEnum.optional(),
  amenities: ratingEnum.optional(),
  pool_fitness_center: ratingEnum.optional(),

  is_active: z.boolean().optional(),
});
