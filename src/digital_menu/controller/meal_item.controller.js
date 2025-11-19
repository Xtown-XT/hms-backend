// src/digital_menu/controller/meal_item.controller.js
import BaseService from "../../services/service.js";
import { createMealItemSchema, updateMealItemSchema, deleteMealItemSchema } from "../dto/meal_item.dto.js"; 
import MealItem from "../model/meal_item.model.js";

const isAdmin = (req) => req.user && req.user.role === "admin";

const mealItemService = new BaseService(MealItem);

// ✅ Create Meal Item (Admin Only)
export const createMealItem = async (req, res) => {
  try {
    const validatedData = createMealItemSchema.parse(req.body);
    
    const mealItem = await mealItemService.create(validatedData);

    return res.status(201).json({
      message: "Meal Item created successfully",
      data: mealItem
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Get All Meal Items (Admin Only)
export const getAllMealItems = async (req, res) => {
  try {
    const { includeInactive = false, search, page = 1, limit = 10, orderBy = "createdAt", order = "asc" } = req.query;

    const result = await mealItemService.getAll({
      includeInactive: includeInactive === "true",
      search,
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy,
      order
    });

    return res.status(200).json({
      message: "Meal Items fetched successfully",
      total: result.count,
      page: parseInt(page),
      totalPages: Math.ceil(result.count / limit),
      data: result.rows
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Get Meal Item by ID (Admin Only)
export const getMealItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const mealItem = await mealItemService.getById(id);

    if (!mealItem) {
      return res.status(404).json({ message: "Meal Item not found" });
    }

    return res.status(200).json({
      message: "Meal Item found successfully",
      data: mealItem
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// ✅ Update Meal Item (Admin Only)
export const updateMealItem = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateMealItemSchema.parse(req.body);

    const mealItem = await mealItemService.update(id, validatedData);

    if (!mealItem) {
      return res.status(404).json({ message: "Meal Item not found" });
    }

    return res.status(200).json({
      message: "Meal Item updated successfully",
      data: mealItem
    });
  } catch (error) {
    // Handle validation or other errors
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Soft Delete Meal Item (Admin Only)
export const deleteMealItem = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedDelete = deleteMealItemSchema.parse(req.body);

    const mealItem = await mealItemService.delete(id, validatedDelete);

    if (!mealItem) {
      return res.status(404).json({ message: "Meal Item not found" });
    }

    return res.status(200).json({
      message: "Meal Item soft-deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Restore Meal Item (Admin Only)
export const restoreMealItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Admin access check
    if (!isAdmin(req))
      return res.status(403).json({ message: "Access denied. Admins only." });

    // Fetch the meal item including soft-deleted records
    const mealItem = await MealItem.findByPk(id, { paranoid: false });
    if (!mealItem) return res.status(404).json({ message: "Meal Item not found" });

    // Restore if soft-deleted
    if (mealItem.deletedAt !== null) {
      await mealItem.restore();
    }

    // Apply optional updates from request body
    const updates = req.body || {};
    if (Object.keys(updates).length > 0) {
      await mealItem.update(updates);
    }

    return res.status(200).json({
      message: "Meal Item restored successfully",
      data: mealItem, // returns restored/updated object
    });
  } catch (error) {
    console.error("Restore Meal Item Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// User (Read-Only) Access

// ✅ Get All Meal Items (Read-Only for Users)
export const getAllMealItemsForUser = async (req, res) => {
  try {
    const { includeInactive = false, search, page = 1, limit = 10, orderBy = "createdAt", order = "asc" } = req.query;

    const result = await mealItemService.getAll({
      includeInactive: false, // Users can only see active Meal Items
      search,
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy,
      order
    });

    return res.status(200).json({
      message: "Meal Items fetched successfully",
      total: result.count,
      page: parseInt(page),
      totalPages: Math.ceil(result.count / limit),
      data: result.rows
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Get Meal Item by ID (Read-Only for Users)
export const getMealItemByIdForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const mealItem = await mealItemService.getById(id);

    if (!mealItem) {
      return res.status(404).json({ message: "Meal Item not found" });
    }

    return res.status(200).json({
      message: "Meal Item found successfully",
      data: mealItem
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export default {
  createMealItem,
  getAllMealItems,
  getMealItemById,
  updateMealItem,
  deleteMealItem,
  restoreMealItem,
  getAllMealItemsForUser,
  getMealItemByIdForUser,
};
