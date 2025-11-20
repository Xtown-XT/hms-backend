import { Router } from 'express';
import MealItemController from '../controller/meal_item.controller.js';
import { verifyToken, authorizeRole } from '../../middleware/index.js';
import { uploadMealItem } from "../../middleware/upload.js";

const router = Router();

// Create Meal Item with Image
router.post(
  '/createmealitem',
  verifyToken,
  authorizeRole(['admin']),
  uploadMealItem.single("image"),
  MealItemController.createMealItem
);

// Get All
router.get(
  '/mealitems',
  verifyToken,
  authorizeRole(['admin', 'user']),
  MealItemController.getAllMealItems
);

// Get by ID
router.get(
  '/mealitem/:id',
  verifyToken,
  authorizeRole(['admin', 'user']),
  MealItemController.getMealItemById
);

// Update with new image
router.put(
  '/updatemealitem/:id',
  verifyToken,
  authorizeRole(['admin']),
  uploadMealItem.single("image"),
  MealItemController.updateMealItem
);

// Delete
router.delete(
  '/deletemealitem/:id',
  verifyToken,
  authorizeRole(['admin']),
  MealItemController.deleteMealItem
);

// Restore
router.patch(
  '/mealitem/restore/:id',
  verifyToken,
  authorizeRole(['admin']),
  MealItemController.restoreMealItem
);

export default router;
