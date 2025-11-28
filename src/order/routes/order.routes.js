import { Router } from "express";
import OrderController from "../controller/order.controller.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

router.post(
  "/createorder",
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
  "/updateorder/:id",
  verifyToken,
  authorizeRole(["admin"]),
  OrderController.updateOrder
);

router.delete(
  "/deleteorder/:id",
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
