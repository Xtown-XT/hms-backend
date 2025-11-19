// src/modules/guest_feedback/guest_feedback.validation.js
import { z } from "zod";

const uuidSchema = z.string().uuid({ message: "Must be a valid UUID" });

// Create Feedback
export const createGuestFeedbackSchema = z.object({
  guest_id: uuidSchema,
  room_id: uuidSchema,
  rating: z.number().int().min(1).max(5),
  service_rating: z.number().int().min(1).max(5).optional(),
  cleanliness_rating: z.number().int().min(1).max(5).optional(),
  food_rating: z.number().int().min(1).max(5).optional(),
  comments: z.string().max(255).optional(),
  feedback_type: z.enum(["Complaint", "Suggestion", "Compliment", "General"]).default("General"),
  category: z.enum(["service", "food", "room", "general"]).optional(),
  is_active: z.boolean().optional(),
});

// Update Feedback
export const updateGuestFeedbackSchema = z.object({
  feedback_id: uuidSchema,
  rating: z.number().int().min(1).max(5).optional(),
  service_rating: z.number().int().min(1).max(5).optional(),
  cleanliness_rating: z.number().int().min(1).max(5).optional(),
  food_rating: z.number().int().min(1).max(5).optional(),
  comments: z.string().max(255).optional(),
  feedback_type: z.enum(["Complaint", "Suggestion", "Compliment", "General"]).optional(),
  category: z.enum(["service", "food", "room", "general"]).optional(),
  is_active: z.boolean().optional(),
});
