import fs from "fs";
import path from "path";
import Category from "../model/category.model.js";
import BaseService from "../../services/service.js";

const categoryService = new BaseService(Category);

// Helper to generate full image URL
const formatImageUrl = (req, filename, folder = "category") => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${folder}/${filename}`;
};



// Helper to delete old image file
const deleteImageFile = (filename, folder = "category") => {
  if (!filename) return;
  const filePath = path.join("uploads", folder, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.image = req.file.filename;
    payload.created_by = req.user?.id ?? "system";

    const category = await categoryService.create(payload);
    // const data = category.toJSON();
    // image: req.file ? req.file.filename : null;

    // // if (data.image) data.image = formatImageUrl(req, data.image);

    return res.status(201).json({ success: true, message: "Category created", category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, includeInactive = false, orderBy = "createdAt", order = "DESC" } = req.query;

    const result = await categoryService.getAll({
      search,
      page: Number(page),
      limit: Number(limit),
      includeInactive: includeInactive === "true",
      orderBy,
      order,
      searchFields: ["item_name", "cuisine"],
    });

    // const formatted = result.rows.map(cat => {
    //   const json = cat.toJSON();

      const baseUrl = `${req.protocol}://${req.get("host")}`;
    const formatted = result.rows.map((cat) => ({
      ...cat.toJSON(),
      image: cat.image
        ? `${baseUrl}/uploads/category/${cat.image}`
        : null,
    }));

      // if (json.image) json.image = formatImageUrl(req, json.image);
    //   return json;
    // });

    return res.json({ 
      success: true, 
      data: formatted, 
      pagination: { total: result.count, page: result.page, limit: result.limit, totalPages: result.totalPages } 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET CATEGORY BY ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    const data = category.toJSON();
    if (data.image) data.image = formatImageUrl(req, data.image);

    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const payload = { ...req.body };
    const category = await categoryService.getById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    // Delete old image if new image uploaded
    if (req.file && category.image) deleteImageFile(category.image);

    if (req.file) payload.image = req.file.filename;

    const updated = await categoryService.update(req.params.id, payload);
    const data = updated.toJSON();
    if (data.image) data.image = formatImageUrl(req, data.image);

    return res.json({ success: true, message: "Category updated", data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// SOFT DELETE CATEGORY
export const softDeleteCategory = async (req, res) => {
  try {
    const category = await categoryService.getById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    // Optionally, delete image from server on delete
    if (category.image) deleteImageFile(category.image);

    await categoryService.delete(req.params.id);
    return res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// RESTORE CATEGORY
export const restoreCategory = async (req, res) => {
  try {
    const restored = await categoryService.restore(req.params.id);
    if (!restored) return res.status(404).json({ success: false, message: "Category not found or already active" });

    const data = restored.toJSON();
    if (data.image) data.image = formatImageUrl(req, data.image);

    return res.json({ success: true, message: "Category restored", data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

