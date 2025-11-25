// src/modules/cuisine/cuisine.controller.js
import BaseService from "../../services/service.js";
import { createCuisineSchema, updateCuisineSchema, deleteCuisineSchema } from "../dto/cuisine.dto.js";
import Cuisine from "../model/cuisine.model.js";

const isAdmin = (req) => req.user && req.user.role === "admin";

const cuisineService = new BaseService(Cuisine);

// Admin CRUD operations

// ✅ Create Cuisine (Admin Only)
export const createCuisine = async (req, res) => {
  try {
    const validatedData = createCuisineSchema.parse(req.body);
    const cuisine = await cuisineService.create(validatedData);
    return res.status(201).json({
      message: "Cuisine created successfully",
      data: cuisine
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Get All Cuisines (Admin Only for full access)
export const getAllCuisines = async (req, res) => {
  try {
    const { includeInactive = false, search, page = 1, limit = 10, orderBy = "createdAt", order = "asc" } = req.query;

    const result = await cuisineService.getAll({
      includeInactive: includeInactive === "true",
      search,
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy,
      order
    });

    return res.status(200).json({
      message: "Cuisines fetched successfully",
      total: result.count,
      page: parseInt(page),
      totalPages: Math.ceil(result.count / limit),
      data: result.rows
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Get Cuisine by ID (Admin Only for full access)
export const getCuisineById = async (req, res) => {
  try {
    const { id } = req.params;
    const cuisine = await cuisineService.getById(id);

    if (!cuisine) {
      return res.status(404).json({ message: "Cuisine not found" });
    }

    return res.status(200).json({
      message: "Cuisine found successfully",
      data: cuisine
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// ✅ Update Cuisine (Admin Only)
export const updateCuisine = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateCuisineSchema.parse(req.body);

    const cuisine = await cuisineService.update(id, validatedData);

    if (!cuisine) {
      return res.status(404).json({ message: "Cuisine not found" });
    }

    return res.status(200).json({
      message: "Cuisine updated successfully",
      data: cuisine
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Soft Delete Cuisine (Admin Only)
export const deleteCuisine = async (req, res) => {

  try {
    const { id } = req.params;

    const cuisine = await cuisineService.delete(id);

    if (!cuisine) {
      return res.status(404).json({ message: "Cuisine not found" });
    }

    return res.status(200).json({
      message: "Cuisine soft-deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Restore Cuisine (Admin Only) — returns updated object
export const restoreCuisine = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isAdmin(req))
      return res.status(403).json({ message: "Access denied. Admins only." });
    const cuisine = await Cuisine.findByPk(id, { paranoid: false });
    if (!cuisine) return res.status(404).json({ message: "Cuisine not found" });
    if (cuisine.deletedAt !== null) {
      await cuisine.restore();
    }
    const updates = req.body || {};
    if (Object.keys(updates).length > 0) {
      await cuisine.update(updates);
    }
    return res.status(200).json({
      message: "Cuisine restored successfully",
      data: cuisine, 
    });
  } catch (error) {
    console.error("Restore Cuisine Error:", error);
    return res.status(500).json({ error: error.message });
  }
};


// ✅ Get All Cuisines (Read-Only for Users)
export const getAllCuisinesForUser = async (req, res) => {
  try {
    const { includeInactive = false, search, page = 1, limit = 10, orderBy = "createdAt", order = "asc" } = req.query;

    const result = await cuisineService.getAll({
      includeInactive: false,  
      search,
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy,
      order
    });

    return res.status(200).json({
      message: "Cuisines fetched successfully",
      total: result.count,
      page: parseInt(page),
      totalPages: Math.ceil(result.count / limit),
      data: result.rows
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Get Cuisine by ID (Read-Only for Users)
export const getCuisineByIdForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const cuisine = await cuisineService.getById(id);

    if (!cuisine) {
      return res.status(404).json({ message: "Cuisine not found" });
    }
    return res.status(200).json({
      message: "Cuisine found successfully",
      data: cuisine
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export default {
  createCuisine,
  getAllCuisines,
  getCuisineById,
  updateCuisine,
  deleteCuisine,
  restoreCuisine,
  getAllCuisinesForUser,
  getCuisineByIdForUser,
};
