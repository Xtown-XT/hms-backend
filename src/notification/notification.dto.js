import { z } from "zod";

// Common UUID validator
const uuidSchema = z.string().uuid({ message: "Must be a valid UUID" });

/**
 * ✅ Create Notification Schema
 * Matches the Notification model structure
 */
export const createNotificationSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title cannot be empty"),

  message: z
    .string({ required_error: "Message is required" })
    .min(1, "Message cannot be empty"),

  recipientType: z
    .enum(["user", "admin", "superadmin", "staff", "all"])
    .default("all"),

  recipientId: uuidSchema.optional().nullable(),

  isRead: z.boolean().optional().default(false),
});

/**
 * ✅ Update Notification Schema
 * For marking as read or editing title/message
 */
export const updateNotificationSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  message: z.string().min(1, "Message cannot be empty").optional(),
  recipientType: z
    .enum(["user", "admin", "superadmin", "staff", "all"])
    .optional(),
  recipientId: uuidSchema.optional().nullable(),
  isRead: z.boolean().optional(),
});
