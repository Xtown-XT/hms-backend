import { Router } from 'express';
import RoomServiceController from '../room_service/room_service.controller.js';
import { verifyToken, authorizeRole } from '../middleware/index.js';

const router = Router();

router.get('/roomservice', verifyToken, authorizeRole(['admin']), RoomServiceController.getAllRequests);
router.get('/roomservice/:id', verifyToken, authorizeRole(['admin','user']), RoomServiceController.getRequestById);
router.post('/roomservice', verifyToken, authorizeRole(['admin','user']), RoomServiceController.createRequest);
router.put('/roomservice/:id', verifyToken, authorizeRole(['admin','user']), RoomServiceController.updateRequest);
router.delete('/roomservice/:id', verifyToken, authorizeRole(['admin']), RoomServiceController.deleteRequest);
router.patch('/roomservice/restore/:id', verifyToken, authorizeRole(['admin']), RoomServiceController.restoreRequest);

export default router;
