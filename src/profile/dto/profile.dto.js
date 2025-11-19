import { z } from "zod";

// ------------------ CREATE PROFILE ------------------
export const createProfileSchema = z.object({
  company_name: z.string().max(255, { message: "Company name too long" }),
  address: z.string().max(255, { message: "Address too long" }),
  gst_number: z.string().max(15, { message: "GST number too long" }),
  phone: z.string().max(15, { message: "Phone number too long" }),
  email: z.string().email({ message: "Invalid email format" }),
  profile_image: z
    .any()
    .optional() // will be populated from multer: req.file
    .nullable(),
  is_active: z.boolean().optional().default(true),
  created_by: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
});

// ------------------ UPDATE PROFILE ------------------
export const updateProfileSchema = z.object({
  company_name: z.string().max(255).optional(),
  address: z.string().max(255).optional(),
  gst_number: z.string().max(15).optional(),
  phone: z.string().max(15).optional(),
  email: z.string().email().optional(),
  profile_image: z.any().optional().nullable(), // multer file
  is_active: z.boolean().optional(),
  updated_by: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
});

// ------------------ PROFILE PARAMS ------------------
export const profileParamsSchema = z.object({
  profile_id: z.string().uuid({ message: "Invalid profile ID" }),
});

// ------------------ GET PROFILE LIST ------------------
export const getProfileListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  is_active: z.coerce.boolean().optional(),
  sort_by: z
    .enum(["company_name", "email", "createdAt", "updatedAt", "is_active"])
    .optional()
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  include: z.union([z.string(), z.array(z.string())]).optional(),
});
