
import { Router } from "express";
import OrderItemController from "../controller/order_items.controller.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

// ✅ Create Order Item
router.post(
  "/createorderitem",
  verifyToken,
  authorizeRole(["admin", "user"]),
  OrderItemController.createOrderItem
);

// ✅ Get All Order Items
router.get(
  "/orderitems",
  verifyToken,
  authorizeRole(["admin", "staff", "user"]),
  OrderItemController.getAllOrderItems
);

// ✅ Get Order Item By ID
router.get(
  "/orderitem/:id",
  verifyToken,
  authorizeRole(["admin", "staff", "user"]),
  OrderItemController.getOrderItemById
);

// ✅ Update Order Item (Only Admin)
router.put(
  "/updateorderitem/:id",
  verifyToken,
  authorizeRole(["admin"]),
  OrderItemController.updateOrderItem
);

// ✅ Delete Order Item (Only Admin)
router.delete(
  "/deleteorderitem/:id",
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
