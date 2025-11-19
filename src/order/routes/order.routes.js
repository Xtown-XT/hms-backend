
// import { Router } from 'express';
// import orderController from '../controller/order.controller.js';
// import { verifyToken, authorizeRole } from "../../middleware/index.js";

// const router = Router();

// // Create 
// router.post('/order', orderController.createOrder);
// router.get('/daily-report', orderController.getDailyReport);

// // Get all orders
// router.get('/order', verifyToken, authorizeRole(["admin"]), orderController.getAllOrders);

// // Get a single order by ID
// router.get('/order/:id', verifyToken, authorizeRole(["admin"]), orderController.getOrderById);

// // Update order status
// router.patch('/order/status/:id', verifyToken, authorizeRole(["admin"]), orderController.updateOrderStatus);

// // Soft delete order
// router.delete('/order/:id', verifyToken, authorizeRole(["admin"]), orderController.deleteOrder);

// // Add item to existing order
// router.post('/order/items/:id', verifyToken, authorizeRole(["admin"]), orderController.addItem);

// export default router;






import { Router } from "express";
import OrderController from "../controller/order.controller.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

router.post(
  "/order",
  verifyToken,
  authorizeRole(["admin", "user"]),
  OrderController.createOrder
);

router.get(
  "/orders",
  verifyToken,
  authorizeRole(["admin", "staff", "user"]),
  OrderController.getAllOrders
);

router.get(
  "/order/:id",
  verifyToken,
  authorizeRole(["admin", "staff", "user"]),
  OrderController.getOrderById
);

router.put(
  "/order/:id",
  verifyToken,
  authorizeRole(["admin"]),
  OrderController.updateOrder
);

router.delete(
  "/order/:id",
  verifyToken,
  authorizeRole(["admin"]),
  OrderController.deleteOrder
);

router.patch(
  "/order/restore/:id",
  verifyToken,
  authorizeRole(["admin"]),
  OrderController.restoreOrder
);

export default router;
