import { z } from "zod";

// ✅ Helper: validate tax percentage (0 - 100, up to 2 decimals)
const taxPercentageSchema = z.preprocess(
  (val) => (typeof val === "string" ? val.trim() : val),
  z
    .union([z.string(), z.number()])
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
      { message: "Tax percentage must be between 0 and 100" }
    )
    .transform((v) => Number(v))
);

// ✅ Create schema
export const createTaxSchema = z.object({
  tax_name: z
    .string({ required_error: "tax_name is required" })
    .min(1, "tax_name cannot be empty")
    .max(100, "tax_name too long"),

  tax_percentage: taxPercentageSchema,

  tax_type: z
    .enum(["inclusive", "exclusive"], {
      required_error: "tax_type must be either inclusive or exclusive",
    })
    .optional()
    .default("exclusive"),

  description: z.string().optional().nullable(),

  is_active: z.boolean().optional().default(true),

  // Optional user and metadata fields
  created_by: z.string().uuid("Invalid UUID").optional().nullable(),
  updated_by: z.string().uuid("Invalid UUID").optional().nullable(),

  // Optional region and tax details
  country: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  tax_code: z.string().max(50).optional().nullable(),

  effective_from: z
    .string()
    .optional()
    .nullable()
    .refine(
      (v) => v === null || v === undefined || !isNaN(Date.parse(String(v))),
      { message: "effective_from must be a valid date string" }
    ),

  effective_to: z
    .string()
    .optional()
    .nullable()
    .refine(
      (v) => v === null || v === undefined || !isNaN(Date.parse(String(v))),
      { message: "effective_to must be a valid date string" }
    ),
});

// ✅ Update schema (all optional)
export const updateTaxSchema = createTaxSchema.partial();