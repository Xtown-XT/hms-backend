import express from 'express';
import orderRoutes from './order.routes.js';
import billRoutes from './bill.routes.js';
import paymentRoutes from './payment.routes.js';
import OrderItemRoutes from './order_items.routes.js';
import CartRoutes from './cart.routes.js';


const router = express.Router();

router.use('/order', orderRoutes);
router.use('/order', billRoutes);
router.use('/order', paymentRoutes);
router.use('/order', OrderItemRoutes);
router.use('/order', CartRoutes);


export default router;