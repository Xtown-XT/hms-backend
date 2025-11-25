import BaseService from "../../services/service.js";
import { createMealTypeSchema, updateMealTypeSchema, deleteMealTypeSchema } from "../dto/meal_type.dto.js";
import MealType from "../model/meal_type.model.js";

const isAdmin = (req) => req.user && req.user.role === "admin";


const mealTypeService = new BaseService(MealType);


// ✅ Create Meal Type (Admin Only)
export const createMealType = async (req, res) => {
  try {
    const validatedData = createMealTypeSchema.parse(req.body);
    const mealType = await mealTypeService.create(validatedData);
    return res.status(201).json({
      message: "Meal Type created successfully",
      data: mealType
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Get All Meal Types (Admin Only for full access)
export const getAllMealTypes = async (req, res) => {
  try {
    const { includeInactive = false, search, page = 1, limit = 10, orderBy = "createdAt", order = "asc" } = req.query;

    const result = await mealTypeService.getAll({
      includeInactive: includeInactive === "true",
      search,
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy,
      order
    });

    return res.status(200).json({
      message: "Meal Types fetched successfully",
      total: result.count,
      page: parseInt(page),
      totalPages: Math.ceil(result.count / limit),
      data: result.rows
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Get Meal Type by ID (Admin Only for full access)
export const getMealTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const mealType = await mealTypeService.getById(id);

    if (!mealType) {
      return res.status(404).json({ message: "Meal Type not found" });
    }

    return res.status(200).json({
      message: "Meal Type found successfully",
      data: mealType
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// ✅ Update Meal Type (Admin Only)
export const updateMealType = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateMealTypeSchema.parse(req.body);

    const mealType = await mealTypeService.update(id, validatedData);

    if (!mealType) {
      return res.status(404).json({ message: "Meal Type not found" });
    }

    return res.status(200).json({
      message: "Meal Type updated successfully",
      data: mealType
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Soft Delete Meal Type (Admin Only)
export const deleteMealType = async (req, res) => {
  try {
    const { id } = req.params;
    // const validatedDelete = deleteMealTypeSchema.parse(req.body);

    const mealType = await mealTypeService.delete(id);

    if (!mealType) {
      return res.status(404).json({ message: "Meal Type not found" });
    }

    return res.status(200).json({
      message: "Meal Type soft-deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const restoreMealType = async (req, res) => {
  try {
    const { id } = req.params;

    // Admin access check
    if (!isAdmin(req))
      return res.status(403).json({ message: "Access denied. Admins only." });

    // Fetch the meal type including soft-deleted records
    const mealType = await MealType.findByPk(id, { paranoid: false });
    if (!mealType) return res.status(404).json({ message: "Meal Type not found" });

    // Restore if soft-deleted
    if (mealType.deletedAt !== null) {
      await mealType.restore();
    }

    // Apply optional updates from request body
    const updates = req.body || {};
    if (Object.keys(updates).length > 0) {
      await mealType.update(updates);
    }

    return res.status(200).json({
      message: "Meal Type restored successfully",
      data: mealType, // returns restored/updated object
    });
  } catch (error) {
    console.error("Restore Meal Type Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// User (Read-Only) Access

// ✅ Get All Meal Types (Read-Only for Users)
export const getAllMealTypesForUser = async (req, res) => {
  try {
    const { includeInactive = false, search, page = 1, limit = 10, orderBy = "createdAt", order = "asc" } = req.query;

    const result = await mealTypeService.getAll({
      includeInactive: false,  // Users can only see active Meal Types
      search,
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy,
      order
    });

    return res.status(200).json({
      message: "Meal Types fetched successfully",
      total: result.count,
      page: parseInt(page),
      totalPages: Math.ceil(result.count / limit),
      data: result.rows
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Get Meal Type by ID (Read-Only for Users)
export const getMealTypeByIdForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const mealType = await mealTypeService.getById(id);

    if (!mealType) {
      return res.status(404).json({ message: "Meal Type not found" });
    }

    return res.status(200).json({
      message: "Meal Type found successfully",
      data: mealType
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export default {
  createMealType,
  getAllMealTypes,
  getMealTypeById,
  updateMealType,
  deleteMealType,
  restoreMealType,
  getAllMealTypesForUser,
  getMealTypeByIdForUser,
};
