import { Router } from "express";
import CartController from "../controller/cart.controller.js"; // Import CartController
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

router.post(
  "/createcart",
  verifyToken,
  authorizeRole(["admin", "user"]),
  CartController.createCart
);

router.get(
  "/carts",
  verifyToken,
  authorizeRole(["admin", "staff", "user"]),
  CartController.getAllCarts
);

router.get(
  "/cart/:id",
  verifyToken,
  authorizeRole(["admin", "staff", "user"]),
  CartController.getCartById
);

router.put(
  "/updatecart/:id",
  verifyToken,
  authorizeRole(["admin"]),
  CartController.updateCart
);

router.delete(
  "/deletecart/:id",
  verifyToken,
  authorizeRole(["admin"]),
  CartController.deleteCart
);

router.patch(
  "/cart/restore/:id",
  verifyToken,
  authorizeRole(["admin"]),
  CartController.restoreCart
);

export default router;
