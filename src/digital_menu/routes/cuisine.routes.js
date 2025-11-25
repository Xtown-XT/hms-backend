// src/modules/cuisine/cuisine.routes.js

import { Router } from 'express';
import CuisineController from '../controller/cuisine.controller.js';
import { verifyToken, authorizeRole } from '../../middleware/index.js';

const router = Router();

// Admin routes (requires token verification and admin authorization)
router.post('/createcuisine', verifyToken, authorizeRole(['admin']), CuisineController.createCuisine);
router.get('/cuisines', verifyToken, authorizeRole(['admin', 'user']), CuisineController.getAllCuisines);
router.get('/cuisine/:id', verifyToken, authorizeRole(['admin', 'user']), CuisineController.getCuisineById);
router.put('/updatecuisine/:id', verifyToken, authorizeRole(['admin']), CuisineController.updateCuisine);
router.delete('/deletecuisine/:id', verifyToken, authorizeRole(['admin']), CuisineController.deleteCuisine);
router.patch('/cuisine/restore/:id', verifyToken, authorizeRole(['admin']), CuisineController.restoreCuisine);

export default router;
