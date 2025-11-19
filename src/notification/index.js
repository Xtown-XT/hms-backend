import express from 'express';
import NotificationRoutes from './notification.routes.js'; 

const router = express.Router();

router.use('/notification', NotificationRoutes);
export default router;
