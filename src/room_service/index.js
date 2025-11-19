import express from 'express';
import RoomserviceRoutes from '../room_service/room_service.routes.js';

const router = express.Router();

router.use('/room-service', RoomserviceRoutes);
export default router;
