import { z } from "zod";

// ✅ UUID schema
const uuidSchema = z.string().uuid({ message: "Must be a valid UUID" });

// ✅ Guest Feedback Creation Schema
export const createGuestFeedbackSchema = z.object({
  guest_id: uuidSchema, 
  room_id: uuidSchema,   
  waiter_rating: z.number().int().min(1).max(5), 
  housekeeping_rating: z.number().int().min(1).max(5),
  chef_rating: z.number().int().min(1).max(5),
  hotel_rating: z.number().int().min(1).max(5),
  feedback: z.string().max(255), 
  feedback_type: z.enum(['Complaint', 'Suggestion', 'Compliment', 'General']).default('General'),
  guest_email: z.string().email().optional(),
  stay_duration: z.number().int(),
});

// ✅ Guest Feedback Update Schema
export const updateGuestFeedbackSchema = z.object({
  feedback_id: uuidSchema,
  waiter_rating: z.number().int().min(1).max(5),
  housekeeping_rating: z.number().int().min(1).max(5),
  chef_rating: z.number().int().min(1).max(5),
  hotel_rating: z.number().int().min(1).max(5),
  feedback: z.string().max(255),
  feedback_type: z.enum(['Complaint', 'Suggestion', 'Compliment', 'General']),
  guest_email: z.string().email().optional(),
  stay_duration: z.number().int(),
});
