import { Router } from 'express';
import MultiCourseMealController from '../controller/multi_course_meal.controller.js';
import { verifyToken, authorizeRole } from '../../middleware/index.js';
import { validate } from '../../middleware/validate.js';
import {
  createMultiCourseMealSchema,
  updateMultiCourseMealSchema,
  restoreMultiCourseMealSchema
} from '../dto/multi_course_meal.dto.js';
import { uploadMultiCourseMeal } from '../../middleware/upload.js';

const router = Router();

// CREATE MultiCourseMeal (Admin only)
router.post(
  '/createmulticoursemeal',
  verifyToken,
  authorizeRole(['admin']),
  uploadMultiCourseMeal.single('image'), // Accept single image file
  validate(createMultiCourseMealSchema),
  MultiCourseMealController.createMultiCourseMeal
);

// GET all MultiCourseMeals (Admin & User)
router.get(
  '/multicoursemeals',
  verifyToken,
  authorizeRole(['admin', 'user']),
  MultiCourseMealController.getAllMultiCourseMeals
);

// GET MultiCourseMeal by ID (Admin & User)
router.get(
  '/multicoursemeal/:id',
  verifyToken,
  authorizeRole(['admin', 'user']),
  MultiCourseMealController.getMultiCourseMealById
);

// UPDATE MultiCourseMeal (Admin only)
router.put(
  '/updatemulticoursemeal/:id',
  verifyToken,
  authorizeRole(['admin']),
  uploadMultiCourseMeal.single('image'), // Optional new image
  validate(updateMultiCourseMealSchema),
  MultiCourseMealController.updateMultiCourseMeal
);

// DELETE MultiCourseMeal (Admin only)
router.delete(
  '/deletemulticoursemeal/:id',
  verifyToken,
  authorizeRole(['admin']),
  MultiCourseMealController.deleteMultiCourseMeal
);

// RESTORE MultiCourseMeal (Admin only)
router.patch(
  '/multicoursemeal/restore/:id',
  verifyToken,
  authorizeRole(['admin']),
  uploadMultiCourseMeal.single('image'), // Optional new image on restore
  validate(restoreMultiCourseMealSchema),
  MultiCourseMealController.restoreMultiCourseMeal
);

export default router;
