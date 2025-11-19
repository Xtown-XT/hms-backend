// src/modules/multiCourseMeal/multiCourseMeal.routes.js
import { Router } from 'express';
// Import the default export from controller
import MultiCourseMealController from '../controller/multi_course_meal.controller.js';  
import { verifyToken, authorizeRole } from '../../middleware/index.js';

const router = Router();

// Admin routes (requires token verification and admin authorization)
router.post('/multicoursemeal', verifyToken, authorizeRole(['admin']), MultiCourseMealController.createMultiCourseMeal);
router.get('/multicoursemeals', verifyToken, authorizeRole(['admin', 'user']), MultiCourseMealController.getAllMultiCourseMeals);
router.get('/multicoursemeal/:id', verifyToken, authorizeRole(['admin', 'user']), MultiCourseMealController.getMultiCourseMealById);
router.put('/multicoursemeal/:id', verifyToken, authorizeRole(['admin']), MultiCourseMealController.updateMultiCourseMeal);
router.delete('/multicoursemeal/:id', verifyToken, authorizeRole(['admin']), MultiCourseMealController.deleteMultiCourseMeal);
router.patch('/multicoursemeal/restore/:id', verifyToken, authorizeRole(['admin']), MultiCourseMealController.restoreMultiCourseMeal);

export default router;
