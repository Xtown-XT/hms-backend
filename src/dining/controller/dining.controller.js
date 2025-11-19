
// import {
//   createDiningTable as createDiningTableService,
//   getDiningTableById,
//   getAllDiningTables,
//   updateDiningTable as updateDiningTableService,
//   deleteDiningTable,
// } from "../service/dining.service.js";

// // ✅ Create Dining Table
// export const create = async (req, res) => {
//   try {
//     const payload = {
//       ...req.body,
//       created_by: req.user.id,
//       created_by_name: req.user.name,
//       created_by_email: req.user.email,
//     };

//     const diningTable = await createDiningTableService(payload);
//     return res.sendSuccess(diningTable, "Dining Table created successfully", 201);
//   } catch (error) {
//     console.error("Error creating dining table:", error);
//     return res.sendError("Failed to create dining table", 400, error);
//   }
// };

// // ✅ Update Dining Table
// export const update = async (req, res) => {
//   try {
//     const diningTableId = req.params.id;

//     if (!diningTableId || typeof diningTableId !== "string" || diningTableId.trim() === "") {
//       return res.sendError("Invalid dining table ID", 400);
//     }

//     const updatePayload = {
//       ...req.body,
//       updated_by: req.user.id,
//       updated_by_name: req.user.name,
//       updated_by_email: req.user.email,
//     };

//     const updated = await updateDiningTableService(diningTableId, updatePayload);
//     if (!updated) return res.sendError("Dining Table not found or update failed", 404);

//     return res.sendSuccess(updated, "Dining Table updated successfully");
//   } catch (error) {
//     return res.sendError("Failed to update dining table", 400, error);
//   }
// };

// // ✅ Get All Dining Tables
// export const getAll = async (req, res) => {
//   try {
//     const { page, limit, order, is_active } = req.query;

//     const filters = {
//       is_active,
//     };

//     const orderDirection = order?.toUpperCase() === "ASC" || order?.toUpperCase() === "DESC" 
//       ? order.toUpperCase() 
//       : "DESC";

//     const result = await getAllDiningTables({
//       page: parseInt(page || 1, 10),
//       limit: parseInt(limit || 10, 10),
//       filters,
//       order: orderDirection,
//     });

//     return res.sendSuccess(result, "Dining Tables retrieved successfully");
//   } catch (error) {
//     console.error("Error retrieving dining tables:", error);
//     return res.sendError("Failed to retrieve dining tables", 400, error);
//   }
// };

// // ✅ Get Dining Table by ID
// export const getById = async (req, res) => {
//   try {
//     const diningTableId = req.params.id?.trim();
//     const diningTable = await getDiningTableById(diningTableId);

//     if (!diningTable) return res.sendError("Dining Table not found", 404);

//     return res.sendSuccess(diningTable, "Dining Table retrieved successfully");
//   } catch (error) {
//     console.error("Error retrieving dining table by ID:", error);
//     return res.sendError("Failed to retrieve dining table", 400, error);
//   }
// };

// // ✅ Soft Delete Dining Table
// export const remove = async (req, res) => {
//   try {
//     const diningTableId = req.params.id?.trim();
//     const payload = {
//       deleted_by: req.user.id,
//       deleted_by_name: req.user.name,
//       deleted_by_email: req.user.email,
//     };

//     const deleted = await deleteDiningTable(diningTableId, payload);
//     if (!deleted) return res.sendError("Dining Table not found or already deleted", 404);

//     return res.sendSuccess(null, "Dining Table soft-deleted successfully");
//   } catch (error) {
//     console.error("Error deleting dining table:", error);
//     return res.sendError("Failed to delete dining table", 400, error);
//   }
// };


import { DiningTableService } from '../service/dining.service.js';
import { createDiningTableSchema, updateDiningTableSchema } from '../dto/dining.dto.js';

export const DiningTableController = {
  async create(req, res) {
    try {
      const validated = createDiningTableSchema.parse(req.body);
      const table = await DiningTableService.create(validated);
      res.status(201).json(table);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

async findAll(req, res) {
    try {
      const {
        includeInactive = false,
        search,
        page = 1,
        limit = 10,
        orderBy = "createdAt",
        order = "asc",
      } = req.query;

      const result = await DiningTableService.findAll({
        includeInactive: includeInactive === "true", // query params are strings
        search,
        page: parseInt(page),
        limit: parseInt(limit),
        orderBy,
        order,
      });

      res.json({
        total: result.count,
        page: parseInt(page),
        totalPages: Math.ceil(result.count / limit),
        data: result.rows,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params;
      const table = await DiningTableService.findById(id);
      if (!table) return res.status(404).json({ message: 'Not found' });
      res.json(table);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const validated = updateDiningTableSchema.parse(req.body);
      const table = await DiningTableService.update(id, validated);
      if (!table) return res.status(404).json({ message: 'Not found' });
      res.json(table);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

 async softDelete(req, res) {
    try {
      const { id } = req.params;

      // Safely extract from body
      const {
        deleted_by = null,
        deleted_by_name = null,
        deleted_by_email = null
      } = req.body || {};

      const deletedMeta = {
        deleted_by,
        deleted_by_name,
        deleted_by_email
      };

      const table = await DiningTableService.softDelete(id, deletedMeta);

      if (!table) {
        return res.status(404).json({ message: 'Dining table not found' });
      }

      return res.json({ message: 'Soft deleted successfully' });
    } catch (err) {
      console.error('Soft delete error:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  async restore(req, res) {
    try {
      const { id } = req.params;
      const table = await DiningTableService.restore(id);
      if (!table) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Restored successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
