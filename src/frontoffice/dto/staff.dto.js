// src/modules/staff/validation/staff.validation.js
import { z } from "zod";

const uuid = z.string().uuid({ message: "Invalid UUID" });

export const createStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  role: z.enum(["admin", "staff", "manager"]).optional(),
});

export const updateStaffSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "staff", "manager"]).optional(),
});

export const deleteStaffSchema = z.object({
  deleted_by: uuid.optional(),
});
