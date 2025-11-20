import BaseService from "../../services/service.js";
import {
  createMealItemSchema,
  updateMealItemSchema,
  deleteMealItemSchema,
} from "../dto/meal_item.dto.js";

import MealItem from "../model/meal_item.model.js";

const isAdmin = (req) => req.user && req.user.role === "admin";

const mealItemService = new BaseService(MealItem);

// ---------------- CREATE --------------------
export const createMealItem = async (req, res) => {
  try {
    const validatedData = createMealItemSchema.parse({...req.body,price: Number(req.body.price)});

    if (req.file) {
      validatedData.image = `uploads/meal/${req.file.filename}`;
    }

    const mealItem = await mealItemService.create(validatedData);

    return res.status(201).json({
      message: "Meal Item created successfully",
      data: mealItem,
    });

  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
   
};

// ---------------- GET ALL -------------------
export const getAllMealItems = async (req, res) => {
  try {
    const {
      includeInactive = false,
      search,
      page = 1,
      limit = 10,
      orderBy = "createdAt",
      order = "asc",
    } = req.query;

    const result = await mealItemService.getAll({
      includeInactive: includeInactive === "true",
      search,
      page: Number(page),
      limit: Number(limit),
      orderBy,
      order,
    });

    return res.status(200).json({
      message: "Meal Items fetched successfully",
      total: result.count,
      page: Number(page),
      totalPages: Math.ceil(result.count / limit),
      data: result.rows,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ---------------- GET BY ID -------------------
export const getMealItemById = async (req, res) => {
  try {
    const mealItem = await mealItemService.getById(req.params.id);

    if (!mealItem) {
      return res.status(404).json({ message: "Meal Item not found" });
    }

    return res.status(200).json({
      message: "Meal Item found successfully",
      data: mealItem,
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// ---------------- UPDATE --------------------
export const updateMealItem = async (req, res) => {
  try {
    const validatedData = updateMealItemSchema.parse(req.body);

    if (req.file) {
      validatedData.image = `uploads/meal/${req.file.filename}`;
    }

    const mealItem = await mealItemService.update(req.params.id, validatedData);

    if (!mealItem) {
      return res.status(404).json({ message: "Meal Item not found" });
    }

    return res.status(200).json({
      message: "Meal Item updated successfully",
      data: mealItem,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ---------------- DELETE (SOFT) --------------------
export const deleteMealItem = async (req, res) => {
  try {
    const validatedDelete = deleteMealItemSchema.parse(req.body);

    const mealItem = await mealItemService.delete(
      req.params.id,
      validatedDelete
    );

    if (!mealItem) {
      return res.status(404).json({ message: "Meal Item not found" });
    }

    return res
      .status(200)
      .json({ message: "Meal Item soft-deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ---------------- RESTORE --------------------
export const restoreMealItem = async (req, res) => {
  try {
    if (!isAdmin(req))
      return res.status(403).json({ message: "Admins only" });

    const mealItem = await MealItem.findByPk(req.params.id, {
      paranoid: false,
    });

    if (!mealItem)
      return res.status(404).json({ message: "Meal Item not found" });

    if (mealItem.deletedAt) {
      await mealItem.restore();
    }

    if (Object.keys(req.body).length > 0) {
      await mealItem.update(req.body);
    }

    return res.status(200).json({
      message: "Meal Item restored successfully",
      data: mealItem,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  createMealItem,
  getAllMealItems,
  getMealItemById,
  updateMealItem,
  deleteMealItem,
  restoreMealItem,
};
