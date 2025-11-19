import express from 'express';
import InventoryItemRoutes from './inventory_item.routes.js'; 
import StockLogRoutes from './stock_log.routes.js';

const router = express.Router();

router.use('/inventory', InventoryItemRoutes);
router.use('/stock-logs', StockLogRoutes);
export default router;
