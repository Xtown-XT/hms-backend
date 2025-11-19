// src/modules/room/room.routes.js
import { Router } from "express";
import RoomController from "../controller/room.controller.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

// Admin-only routes

router.get(
  "/rooms",
  verifyToken,
  authorizeRole(["admin"]),
  RoomController.getAllRooms
);

router.get(
  "/room/:id",
  verifyToken,
  authorizeRole(["admin"]),
  RoomController.getRoomById
);

router.post(
  "/createroom",
  verifyToken,
  authorizeRole(["admin"]),
  RoomController.createRoom
);

router.put(
  "/room/:id",
  verifyToken,
  authorizeRole(["admin"]),
  RoomController.updateRoom
);

router.delete(
  "/deleteroom/:id",
  verifyToken,
  authorizeRole(["admin"]),
  RoomController.deleteRoom
);

router.patch(
  "/room/restore/:id",
  verifyToken,
  authorizeRole(["admin"]),
  RoomController.restoreRoom
);



export default router;
