import { Router } from "express";
import RoomDeliveryController from "../room_delivery/room_delivery.controller.js";
import { verifyToken, authorizeRole } from "../middleware/index.js";

const router = Router();

// ✅ Admin: View all room deliveries
router.get(
  "/roomdelivery",
  verifyToken,
  authorizeRole(["admin"]),
  RoomDeliveryController.getAllDeliveries
);

// ✅ Admin & User: View specific room delivery by ID
router.get(
  "/roomdelivery/:id",
  verifyToken,
  authorizeRole(["admin", "user"]),
  RoomDeliveryController.getDeliveryById
);

// ✅ Admin & User: Create a new room delivery
router.post(
  "/roomdelivery",
  verifyToken,
  authorizeRole(["admin", "user"]),
  RoomDeliveryController.createDelivery
);

// ✅ Admin: Update room delivery (status/item_check)
router.put(
  "/roomdelivery/:id",
  verifyToken,
  authorizeRole(["admin"]),
  RoomDeliveryController.updateDelivery
);

// ✅ Admin: Delete room delivery
router.delete(
  "/roomdelivery/:id",
  verifyToken,
  authorizeRole(["admin"]),
  RoomDeliveryController.deleteDelivery
);

// ✅ Admin: Restore soft-deleted room delivery
router.patch(
  "/roomdelivery/restore/:id",
  verifyToken,
  authorizeRole(["admin"]),
  RoomDeliveryController.restoreDelivery
);

export default router;
