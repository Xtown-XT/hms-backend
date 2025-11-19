import { z } from "zod";

// ✅ UUID schema
const uuidSchema = z.string().uuid({ message: "Must be a valid UUID" });

// ✅ Room Service Request Creation Schema
export const createRoomServiceRequestSchema = z.object({
  room_id: uuidSchema,  
  guest_id: uuidSchema, 
  request_type: z.enum(['Housekeeping', 'Laundry', 'Towels', 'Maintenance']),  
  request_details: z.string().max(500).optional(),  
});

// ✅ Room Service Request Update Schema
export const updateRoomServiceRequestSchema = z.object({
  request_id: uuidSchema,  
  request_type: z.enum(['Housekeeping', 'Laundry', 'Towels', 'Maintenance']).optional(),  
  request_details: z.string().max(500).optional(), 
  status: z.enum(['pending', 'in-progress', 'completed']).optional(), e
});

