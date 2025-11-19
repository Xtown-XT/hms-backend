// import express from "express";
// import {
//   createOrderItemsBulkController,
//   getAllOrderItemsController,
//   getOrderItemByIdController,
//   updateOrderItemController,
//   deleteOrderItemController,
// } from "../controller/order_items.controller.js";

// const router = express.Router();

// router.post("/order-item", createOrderItemsBulkController);
// router.get("/order-item", getAllOrderItemsController);
// router.get("/order-item/:id", getOrderItemByIdController);
// router.put("/order-item/:id", updateOrderItemController);
// router.delete("/order-item/:id", deleteOrderItemController);

// export default router;


import { Router } from "express";
import OrderItemController from "../controller/order_items.controller.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

// ✅ Create Order Item
router.post(
  "/order-item",
  verifyToken,
  authorizeRole(["admin", "user"]),
  OrderItemController.createOrderItem
);

// ✅ Get All Order Items
router.get(
  "/order-items",
  verifyToken,
  authorizeRole(["admin", "staff", "user"]),
  OrderItemController.getAllOrderItems
);

// ✅ Get Order Item By ID
router.get(
  "/order-item/:id",
  verifyToken,
  authorizeRole(["admin", "staff", "user"]),
  OrderItemController.getOrderItemById
);

// ✅ Update Order Item (Only Admin)
router.put(
  "/order-item/:id",
  verifyToken,
  authorizeRole(["admin"]),
  OrderItemController.updateOrderItem
);

// ✅ Delete Order Item (Only Admin)
router.delete(
  "/order-item/:id",
  verifyToken,
  authorizeRole(["admin"]),
  OrderItemController.deleteOrderItem
);

// ✅ Restore Order Item (Only Admin)
router.patch(
  "/order-item/restore/:id",
  verifyToken,
  authorizeRole(["admin"]),
  OrderItemController.restoreOrderItem
);

export default router;
