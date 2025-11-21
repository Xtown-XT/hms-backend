import express from "express";
import { verifyToken, authorizeRole, validate } from "../../middleware/index.js";
import {uploadCategoryImage } from "../../middleware/upload.js";
import {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  softDeleteCategory,
  restoreCategory,
} from "../controller/category.controller .js"; // fixed import path
import { categorySchema, updateCategorySchema } from "../dto/category.dto.js";

const router = express.Router();

// CREATE CATEGORY
router.post(
  "/createcategory",
  verifyToken,
  authorizeRole(["admin"]),
 uploadCategoryImage.single("image"),
  validate({ body: categorySchema }),
  createCategory
);

// UPDATE CATEGORY
router.put(
  "/updatecategory/:id",
  verifyToken,
  authorizeRole(["admin"]),
  uploadCategoryImage.single("image"),
  validate({ body: updateCategorySchema }),
  updateCategory
);

// GET ALL CATEGORIES
router.get("/category", getAllCategories);

// GET CATEGORY BY ID
router.get("/category/:id", getCategoryById);

// SOFT DELETE CATEGORY
router.delete(
  "/category/:id",
  verifyToken,
  authorizeRole(["admin"]),
  softDeleteCategory
);

// RESTORE CATEGORY
router.patch(
  "/categories/:id/restore",
  verifyToken,
  authorizeRole(["admin"]),
  restoreCategory
);

export default router;
