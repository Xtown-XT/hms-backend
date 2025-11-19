import express from 'express';
import RoomdeliveryRoutes from '../room_delivery/room_delivery.routes.js';

const router = express.Router();

router.use('/room-delivery', RoomdeliveryRoutes);
export default router;
