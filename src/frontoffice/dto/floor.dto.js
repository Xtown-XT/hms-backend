// src/modules/floor/dto/floor.dto.js
import { z } from "zod";

export const createFloorSchema = z.object({
  floor_no: z.coerce.number()
    .int()
    .min(1, "Floor number is required and must be at least 1"),
  description: z.string().optional(),
});

export const updateFloorSchema = z.object({
  floor_no: z.coerce.number()
    .int()
    .min(1, "Floor number must be at least 1")
    .optional(),
  description: z.string().optional(),
});

export const deleteFloorSchema = z.object({});
