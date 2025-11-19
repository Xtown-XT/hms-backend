
// import { z } from "zod";

// // ✅ Create Dining Table DTO
// export const createDiningTableSchema = z.object({
//   table_number: z.number().int().positive({ message: "Table number must be a positive integer" }),
//   is_active: z.boolean().default(true),
//   created_by: z.string().uuid().optional(),  
//   updated_by: z.string().uuid().optional(), 
// });

// // ✅ Update Dining Table DTO (partial updates allowed)
// export const updateDiningTableSchema = z.object({
//   table_number: z.number().int().positive().optional(),
//   is_active: z.boolean().optional(),
//   updated_by: z.string().uuid().optional(), 
// });

// // ✅ Params DTO → must match route `:id`
// export const diningTableParamsSchema = z.object({
//   id: z.string().uuid({ message: "Invalid Dining Table ID" }),
// });

// // ✅ Get Dining Table List DTO (pagination, filters, sorting)
// export const getDiningTableListSchema = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   limit: z.coerce.number().int().min(1).max(100).default(10),
//   search: z.string().optional(),  
//   is_active: z.coerce.boolean().optional(),
//   sort_by: z.enum(["table_number", "createdAt", "updatedAt", "is_active"]).optional().default("createdAt"),
//   order: z.enum(["asc", "desc"]).optional().default("desc"),
//   include: z.union([z.string(), z.array(z.string())]).optional(),
// });



import { z } from 'zod';

export const createDiningTableSchema = z.object({
  table_number: z.string().min(1),
  created_by: z.string().uuid().optional(),
  created_by_name: z.string().optional(),
  created_by_email: z.string().email().optional(),
});

export const updateDiningTableSchema = z.object({
  table_number: z.string().optional(),
  updated_by: z.string().uuid().optional(),
  updated_by_name: z.string().optional(),
  updated_by_email: z.string().email().optional(),
});
