// import { z } from "zod";

// // UUID schema
// const uuidSchema = z.string().uuid();

// // CREATE Guest Schema
// export const createGuestSchema = z.object({
//   firstname: z.string().min(1, "Firstname is required"),
//   lastname: z.string().min(1, "Lastname is required"),
//   phone: z.string().min(8).max(15),
//   email: z.string().email().optional(),
//   address: z.string().optional(),

//   id_proof_no: z.string().min(3, "ID proof no is required"),
//   id_proof_type: z.enum(["Aadhar", "Passport", "Driving License", "Voter ID", "PAN"]),

//   nationality: z.string().min(1),
//   gender: z.enum(["male", "female", "other"]),
//   dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

//   created_by: uuidSchema.optional(),
// });

// // UPDATE Guest Schema
// export const updateGuestSchema = z.object({
//   firstname: z.string().optional(),
//   lastname: z.string().optional(),
//   phone: z.string().min(8).max(15).optional(),
//   email: z.string().email().optional(),
//   address: z.string().optional(),

//   id_proof_no: z.string().optional(),
//   id_proof_type: z
//     .enum(["Aadhar", "Passport", "Driving License", "Voter ID", "PAN"])
//     .optional(),

//   nationality: z.string().optional(),
//   gender: z.enum(["male", "female", "other"]).optional(),
//   dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

//   updated_by: uuidSchema.optional(),
// });

// // DELETE schema
// export const deleteGuestSchema = z.object({
//   id: uuidSchema.optional(),
//   ids: z.array(uuidSchema).optional(),
// }).refine((d) => d.id || (d.ids && d.ids.length), {
//   message: "Either id or ids must be provided",
// });

// // QUERY schema
// export const getGuestsQuerySchema = z.object({
//   page: z.string().optional(),
//   limit: z.string().optional(),
//   search: z.string().optional(),
// });

import { z } from "zod";

const uuidSchema = z.string().uuid();

export const createGuestSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  phone: z.string().min(8).max(15),
  email: z.string().email().optional(),
  address: z.string().optional(),

  id_proof_no: z.string().min(3),
  id_proof_type: z.enum(["Aadhar", "Passport", "Driving License", "Voter ID", "PAN"]),

  nationality: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  room_no: z.number().min(1),
  room_type: z.enum(["Single", "Double", "Deluxe", "Suite"]),
  no_of_guests: z.number().min(1),
  stay_duration: z.number().min(1),
  check_in: z.string(),
  check_out: z.string(),

  booking_source: z.enum(["Walk-in", "Online", "Phone", "Agent"]).default("Walk-in"),

  created_by: uuidSchema.optional(),
});

export const updateGuestSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  phone: z.string().min(8).max(15).optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),

  id_proof_no: z.string().optional(),
  id_proof_type: z.enum(["Aadhar", "Passport", "Driving License", "Voter ID", "PAN"]).optional(),

  nationality: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dob: z.string().optional(),

  room_no: z.number().optional(),
  room_type: z.enum(["Single", "Double", "Deluxe", "Suite"]).optional(),
  no_of_guests: z.number().optional(),
  stay_duration: z.number().optional(),
  check_in: z.string().optional(),
  check_out: z.string().optional(),

  updated_by: uuidSchema.optional(),
});
export const deleteGuestSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});

export const getGuestsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});
