import { z } from "zod";

export const createRoomSchema = z.object({
  room_no: z.coerce.number().int().min(1, "Room number is required"),

  floor_no: z.coerce
    .number()
    .int()
    .min(1, "floor_no is required"),   // FIXED (INTEGER)

  description: z.string().optional()
});

export const updateRoomSchema = z.object({
  room_no: z.coerce.number().int().optional(),

  floor_no: z.coerce.number().int().optional(),  // FIXED (INTEGER)

  description: z.string().optional()
});

export const getRoomsQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),

  floor_no: z.coerce.number().int().optional(), // FIXED (INTEGER)
});
