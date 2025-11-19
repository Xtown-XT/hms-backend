// src/modules/mealType/mealType.routes.js
import { Router } from 'express';
import MealTypeController from '../controller/meal_type.controller.js';
import { verifyToken, authorizeRole } from '../../middleware/index.js';

const router = Router();

// Admin routes (requires token verification and admin authorization)
router.post('/mealtype', verifyToken, authorizeRole(['admin']), MealTypeController.createMealType);
router.get('/mealtypes', verifyToken, authorizeRole(['admin', 'user']), MealTypeController.getAllMealTypes);
router.get('/mealtype/:id', verifyToken, authorizeRole(['admin', 'user']), MealTypeController.getMealTypeById);
router.put('/mealtype/:id', verifyToken, authorizeRole(['admin']), MealTypeController.updateMealType);
router.delete('/mealtype/:id', verifyToken, authorizeRole(['admin']), MealTypeController.deleteMealType);
router.patch('/mealtype/restore/:id', verifyToken, authorizeRole(['admin']), MealTypeController.restoreMealType);

export default router;
