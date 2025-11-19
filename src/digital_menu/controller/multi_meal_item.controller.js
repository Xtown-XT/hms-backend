// src/digital_menu/controller/multi_meal_item.controller.js
import BaseService from "../../services/service.js";
import {
  createMultiMealItemSchema,
  updateMultiMealItemSchema,
  deleteMultiMealItemSchema,
} from "../dto/multi_meal_item.dto.js";
import MultiMealItem from "../model/multi_meal_item.model.js";

const isAdmin = (req) => req.user && req.user.role === "admin";

const multiMealItemService = new BaseService(MultiMealItem);

// ✅ Create MultiMealItem (Admin Only)
export const createMultiMealItem = async (req, res) => {
  try {
    const validatedData = createMultiMealItemSchema.parse(req.body);
    const multiMealItem = await multiMealItemService.create(validatedData);

    return res.status(201).json({
      message: "MultiMealItem created successfully",
      data: multiMealItem,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Get All MultiMealItems (Admin/User)
export const getAllMultiMealItems = async (req, res) => {
  try {
    const {
      includeInactive = false,
      search,
      page = 1,
      limit = 10,
      orderBy = "createdAt",
      order = "asc",
    } = req.query;

    const result = await multiMealItemService.getAll({
      includeInactive: includeInactive === "true",
      search,
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy,
      order,
    });

    return res.status(200).json({
      message: "MultiMealItems fetched successfully",
      total: result.count,
      page: parseInt(page),
      totalPages: Math.ceil(result.count / limit),
      data: result.rows,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Get MultiMealItem by ID
export const getMultiMealItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const multiMealItem = await multiMealItemService.getById(id);

    if (!multiMealItem) {
      return res.status(404).json({ message: "MultiMealItem not found" });
    }

    return res.status(200).json({
      message: "MultiMealItem found successfully",
      data: multiMealItem,
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// ✅ Update MultiMealItem (Admin Only)
export const updateMultiMealItem = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateMultiMealItemSchema.parse(req.body);

    const updatedMultiMealItem = await multiMealItemService.update(id, validatedData);

    if (!updatedMultiMealItem) {
      return res.status(404).json({ message: "MultiMealItem not found" });
    }

    return res.status(200).json({
      message: "MultiMealItem updated successfully",
      data: updatedMultiMealItem,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Soft Delete MultiMealItem
export const deleteMultiMealItem = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedDelete = deleteMultiMealItemSchema.parse(req.body);

    const deleted = await multiMealItemService.delete(id, validatedDelete);

    if (!deleted) {
      return res.status(404).json({ message: "MultiMealItem not found" });
    }

    return res.status(200).json({
      message: "MultiMealItem soft-deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const restoreMultiMealItem = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) return res.status(400).json({ message: "ID is required" });
    id = id.trim();

    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const multiMealItem = await MultiMealItem.findByPk(id, { paranoid: false });
    if (!multiMealItem) return res.status(404).json({ message: "MultiMealItem not found" });

    // Restore if deleted
    if (multiMealItem.deleted_at !== null) {
      await multiMealItem.restore();
    }

    // Allow updating only non-unique fields
    const allowedUpdateFields = ["course_order", "quantity", "price"]; // add any other safe fields
    const updates = {};
    for (const key of allowedUpdateFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length > 0) {
      await multiMealItem.update(updates);
    }

    return res.status(200).json({
      message: "MultiMealItem restored successfully",
      data: multiMealItem,
    });
  } catch (error) {
    console.error("Restore MultiMealItem Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export default {
  createMultiMealItem,
  getAllMultiMealItems,
  getMultiMealItemById,
  updateMultiMealItem,
  deleteMultiMealItem,
  restoreMultiMealItem,
};
