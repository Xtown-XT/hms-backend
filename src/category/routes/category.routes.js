import express from "express";
import { verifyToken, authorizeRole, validate } from "../../middleware/index.js";
import { uploadCategory } from "../../middleware/upload.js";
import {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  softDeleteCategory,
  restoreCategory,
} from "../controller/category.controller .js";
import { categorySchema, updateCategorySchema } from "../dto/category.dto.js";

const router = express.Router();

router.post(
  "/createcategory",
  verifyToken,
  authorizeRole(["admin"]),
  uploadCategory.single("image"),
  validate({ body: categorySchema }),
  createCategory
);

router.put(
  "/category/:id",
  verifyToken,
  authorizeRole(["admin"]),
  uploadCategory.single("image"),
  validate({ body: updateCategorySchema }),
  updateCategory
);

router.get("/category", getAllCategories);
router.get("/category/:id", getCategoryById);
router.delete("/category/:id", verifyToken, authorizeRole(["admin"]), softDeleteCategory);
router.patch("/category/:id/restore", verifyToken, authorizeRole(["admin"]), restoreCategory);

export default router;
