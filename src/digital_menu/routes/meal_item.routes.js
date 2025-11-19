// src/modules/mealItem/mealItem.routes.js
import { Router } from 'express';
import MealItemController from '../controller/meal_item.controller.js'; 
import { verifyToken, authorizeRole } from '../../middleware/index.js'; 

const router = Router();

router.post('/mealitem', verifyToken, authorizeRole(['admin']), MealItemController.createMealItem);
router.get('/mealitems', verifyToken, authorizeRole(['admin', 'user']), MealItemController.getAllMealItems);
router.get('/mealitem/:id', verifyToken, authorizeRole(['admin', 'user']), MealItemController.getMealItemById);
router.put('/mealitem/:id', verifyToken, authorizeRole(['admin']), MealItemController.updateMealItem);
router.delete('/mealitem/:id', verifyToken, authorizeRole(['admin']), MealItemController.deleteMealItem);
router.patch('/mealitem/restore/:id', verifyToken, authorizeRole(['admin']), MealItemController.restoreMealItem);

export default router;
