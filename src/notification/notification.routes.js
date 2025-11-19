import { Router } from "express";
import NotificationController from "../notification/notification.controller.js";
import { verifyToken, authorizeRole } from "../middleware/index.js";


const router = Router();

// Admin only routes
router.post(
  "/notifications",
  verifyToken,
  authorizeRole(["admin"]),
  NotificationController.createNotification
);

router.put(
  "/notifications/:id",
  verifyToken,
  authorizeRole(["admin"]),
  NotificationController.updateNotification
);

router.delete(
  "/notifications/:id",
  verifyToken,
  authorizeRole(["admin"]),
  NotificationController.deleteNotification
);

// Any authenticated user routes
router.get(
  "/notifications",
  verifyToken,
  authorizeRole(["admin", "staff", "user"]),
  NotificationController.getAllNotifications
);

router.get(
  "/notifications/:id",
  verifyToken,
  authorizeRole(["admin", "staff", "user"]),
  NotificationController.getNotificationById
);

export default router;
