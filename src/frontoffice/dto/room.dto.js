import { z } from "zod";

export const createRoomSchema = z.object({
  room_no: z.coerce.number().int().min(1, "Room number is required"),
  floor_id: z.string({ required_error: "floor_id is required" }).uuid("Invalid floor_id format"),
  description: z.string().optional()
});

export const updateRoomSchema = z.object({
  room_no: z.coerce.number().int().min(1).optional(),
  floor_id: z.string().uuid().optional(),
  description: z.string().optional()
});

export const getRoomsQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  floor_id: z.string().uuid().optional(),
});
