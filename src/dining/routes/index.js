import express from 'express';
import diningRoutes from './dining.routes.js';

const router = express.Router();

router.use('/dining', diningRoutes);

export default router;