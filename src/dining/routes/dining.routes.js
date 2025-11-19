// src/modules/dining/dining.routes.js
import { Router } from 'express';
import { DiningTableController } from '../controller/dining.controller.js';
import { verifyToken, authorizeRole } from '../../middleware/index.js';

const router = Router();

router.post('/create', verifyToken, authorizeRole(['admin']), DiningTableController.create);
router.get('/dining-table', verifyToken, authorizeRole(['admin']), DiningTableController.findAll);
router.get('/dining-table/:id', verifyToken, authorizeRole(['admin']), DiningTableController.findById);
router.put('/dining-table/:id', verifyToken, authorizeRole(['admin']), DiningTableController.update);
router.delete('/delete-dining-table/:id', verifyToken, authorizeRole(['admin']), DiningTableController.softDelete);
router.patch('/dining-table/:id/restore', verifyToken, authorizeRole(['admin']), DiningTableController.restore);

export default router;
