// import Category from "../model/category.model.js";
// import BaseService from "../../services/service.js";

// const categoryService = new BaseService(Category);

// // Helper to format image URLs
// const formatImageUrl = (req, filename, folder = "category") => {
//   if (!filename) return null;
//   return `${req.protocol}://${req.get("host")}/uploads/${folder}/${filename}`;
// };

// // CREATE CATEGORY
// export const createCategory = async (req, res) => {
//   try {
//     let {
//       item_name,
//       cuisine,
//       description,
//       price,
//       meal_type,
//       tax_percentage,
//       preparation_time,
//       is_active,
//       is_available,
//       is_multi_course,
//     } = req.body;

//     // Validate required fields
//     if (!item_name || !cuisine || !price) {
//       return res.status(400).json({
//         message: "Item name, cuisine, and price are required.",
//       });
//     }

//     // Check for duplicate category (same name + cuisine)
//     const existing = await Category.findOne({
//       where: { item_name, cuisine },
//       paranoid: false,
//     });

//     if (existing) {
//       return res.status(409).json({
//         message: "Category with this name and cuisine already exists",
//       });
//     }

//     const imageFile = req.file ? req.file.filename : null;

//     const payload = {
//       item_name,
//       cuisine,
//       description,
//       price,
//       meal_type,
//       tax_percentage,
//       preparation_time,
//       is_active,
//       is_available,
//       is_multi_course,
//       image: imageFile,
//       created_by: req.user?.id || "system",
//     };

//     const createdCategory = await categoryService.create(payload);

//     const BASE_URL = `${req.protocol}://${req.get("host")}`;
//     return res.status(201).json({
//       message: "Category created successfully",
//       data: {
//         ...createdCategory.dataValues,
//         image: createdCategory.image
//           ? `${BASE_URL}/uploads/category/${createdCategory.image}`
//           : null,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to create category",
//       error: error.message,
//     });
//   }
// };


// // GET ALL
// export const getAllCategories = async (req, res) => {
//   try {
//     const { search = "", page = 1, limit = 10, includeInactive = false, orderBy = "createdAt", order = "DESC" } = req.query;

//     const result = await categoryService.getAll({
//       search,
//       page: Number(page),
//       limit: Number(limit),
//       includeInactive: includeInactive === "true",
//       orderBy,
//       order,
//       searchFields: ["item_name", "cuisine"],
//     });

//     const formatted = result.rows.map(cat => {
//       const json = cat.toJSON();
//       if (json.image) json.image = formatImageUrl(req, json.image);
//       return json;
//     });

//     return res.json({ success: true, data: formatted, pagination: { total: result.count, page: result.page, limit: result.limit, totalPages: result.totalPages } });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // GET BY ID
// export const getCategoryById = async (req, res) => {
//   try {
//     const category = await categoryService.getById(req.params.id);
//     if (!category) return res.status(404).json({ success: false, message: "Category not found" });

//     const data = category.toJSON();
//     if (data.image) data.image = formatImageUrl(req, data.image);

//     return res.json({ success: true, data });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // UPDATE
// export const updateCategory = async (req, res) => {
//   try {
//     const payload = { ...req.body };
//     if (req.file) payload.image = req.file.filename;

//     const updated = await categoryService.update(req.params.id, payload);
//     if (!updated) return res.status(404).json({ success: false, message: "Category not found" });

//     const data = updated.toJSON();
//     if (data.image) data.image = formatImageUrl(req, data.image);

//     return res.json({ success: true, message: "Category updated", data });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // SOFT DELETE
// export const softDeleteCategory = async (req, res) => {
//   try {
//     const deleted = await categoryService.delete(req.params.id);
//     if (!deleted) return res.status(404).json({ success: false, message: "Category not found" });

//     return res.json({ success: true, message: "Category deleted" });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // RESTORE
// export const restoreCategory = async (req, res) => {
//   try {
//     const restored = await categoryService.restore(req.params.id);
//     if (!restored) return res.status(404).json({ success: false, message: "Category not found or already active" });

//     const data = restored.toJSON();
//     if (data.image) data.image = formatImageUrl(req, data.image);

//     return res.json({ success: true, message: "Category restored", data });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


import Category from "../model/category.model.js";
import BaseService from "../../services/service.js";

const categoryService = new BaseService(Category);

const formatImageUrl = (req, filename, folder = "category") => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${folder}/${filename}`;
};

// CREATE
export const createCategory = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.image = req.file.filename;
    payload.created_by = req.user?.id ?? null;

    const category = await categoryService.create(payload);
    const data = category.toJSON();
    if (data.image) data.image = formatImageUrl(req, data.image);

    return res.status(201).json({ success: true, message: "Category created", data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL
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

    const formatted = result.rows.map(cat => {
      const json = cat.toJSON();
      if (json.image) json.image = formatImageUrl(req, json.image);
      return json;
    });

    return res.json({ success: true, data: formatted, pagination: { total: result.count, page: result.page, limit: result.limit, totalPages: result.totalPages } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET BY ID
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

// UPDATE
export const updateCategory = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.image = req.file.filename;

    const updated = await categoryService.update(req.params.id, payload);
    if (!updated) return res.status(404).json({ success: false, message: "Category not found" });

    const data = updated.toJSON();
    if (data.image) data.image = formatImageUrl(req, data.image);

    return res.json({ success: true, message: "Category updated", data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// SOFT DELETE
export const softDeleteCategory = async (req, res) => {
  try {
    const deleted = await categoryService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Category not found" });

    return res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// RESTORE
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