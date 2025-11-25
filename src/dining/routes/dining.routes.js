// src/modules/dining/dining.routes.js
import { Router } from 'express';
import { DiningTableController } from '../controller/dining.controller.js';
import { verifyToken, authorizeRole } from '../../middleware/index.js';

const router = Router();

router.post('/createtable', verifyToken, authorizeRole(['admin']), DiningTableController.create);
router.get('/getalltable', verifyToken, authorizeRole(['admin']), DiningTableController.findAll);
router.get('/table/:id', verifyToken, authorizeRole(['admin']), DiningTableController.findById);
router.put('/updatetable/:id', verifyToken, authorizeRole(['admin']), DiningTableController.update);
router.delete('/deletetable/:id', verifyToken, authorizeRole(['admin']), DiningTableController.delete);
router.patch('/dining-table/:id/restore', verifyToken, authorizeRole(['admin']), DiningTableController.restore);

export default router;
