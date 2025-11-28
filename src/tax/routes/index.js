import express from 'express';

import taxRoutes from './tax.routes.js';

const router = express.Router();

router.use('/tax', taxRoutes);

export default router;