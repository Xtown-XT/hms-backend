import express from 'express';
import cuisineRoutes from './cuisine.routes.js'; 
import mealTypeRoutes from './meal_type.routes.js';
import multiCourseMealRoutes from './multi_course_meal.routes.js';
import mealItemRoutes from './meal_item.routes.js';
import multiMealItemRoutes from './multi_meal_item.routes.js';

const router = express.Router();

router.use('/digital_menu', cuisineRoutes);
router.use('/digital_menu', mealTypeRoutes);
router.use('/digital_menu', multiCourseMealRoutes);
router.use('/digital_menu', mealItemRoutes);
router.use('/digital_menu', multiMealItemRoutes);




export default router;
