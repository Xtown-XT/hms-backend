// src/modules/multiMealItem/multiMealItem.routes.js
import { Router } from "express";
import MultiMealItemController from "../controller/multi_meal_item.controller.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

// ✅ Create a new MultiMealItem
router.post(
  "/createmultimealitem",
  verifyToken,
  authorizeRole(["admin"]),
  MultiMealItemController.createMultiMealItem
);

// ✅ Get all MultiMealItems
router.get(
  "/multimealitems",
  verifyToken,
  authorizeRole(["admin", "user"]),
  MultiMealItemController.getAllMultiMealItems
);

// ✅ Get a MultiMealItem by ID
router.get(
  "/multimealitem/:id",
  verifyToken,
  authorizeRole(["admin", "user"]),
  MultiMealItemController.getMultiMealItemById
);

// ✅ Update a MultiMealItem
router.put(
  "/updatemultimealitem/:id",
  verifyToken,
  authorizeRole(["admin"]),
  MultiMealItemController.updateMultiMealItem
);

// ✅ Soft delete a MultiMealItem
router.delete(
  "/deletemultimealitem/:id",
  verifyToken,
  authorizeRole(["admin"]),
  MultiMealItemController.deleteMultiMealItem
);

// ✅ Restore a deleted MultiMealItem
router.patch(
  "/multimealitem/restore/:id",
  verifyToken,
  authorizeRole(["admin"]),
  MultiMealItemController.restoreMultiMealItem
);

export default router;
