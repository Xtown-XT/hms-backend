import express from 'express';
import cuisineRoutes from './cuisine.routes.js'; 
import mealTypeRoutes from './meal_type.routes.js';
import multiCourseMealRoutes from './multi_course_meal.routes.js';
import mealItemRoutes from './meal_item.routes.js';
import multiMealItemRoutes from './multi_meal_item.routes.js';

const router = express.Router();

router.use('/digitalmenu', cuisineRoutes);
router.use('/digitalmenu', mealTypeRoutes);
router.use('/digitalmenu', multiCourseMealRoutes);
router.use('/digitalmenu', mealItemRoutes);
router.use('/digitalmenu', multiMealItemRoutes);




export default router;
