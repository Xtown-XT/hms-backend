import express from 'express';
import guestRoutes from './guest.routes.js'; 
import floorRoutes from './floor.routes.js';
import roomRoutes from './room.routes.js';
import EmployeeRoutes from './staff.routes.js';


const router = express.Router();

router.use('/frontoffice', guestRoutes);
router.use('/frontoffice', floorRoutes);
router.use('/frontoffice', roomRoutes);
router.use('/frontoffice', EmployeeRoutes);


export default router;
