// src/modules/room/room.routes.js

import { Router } from "express";

import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  restoreRoom
} from "../controller/room.controller.js";

import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

// -----------------------------------------------------
// Admin Routes
// -----------------------------------------------------

router.get(
  "/rooms",
  verifyToken,
  authorizeRole(["admin"]),
  getAllRooms
);

router.get(
  "/room/:id",
  verifyToken,
  authorizeRole(["admin"]),
  getRoomById
);

router.post(
  "/createroom",
  verifyToken,
  authorizeRole(["admin"]),
  createRoom
);

router.put(
  "/room/:id",
  verifyToken,
  authorizeRole(["admin"]),
  updateRoom
);

router.delete(
  "/room/:id",
  verifyToken,
  authorizeRole(["admin"]),
  deleteRoom
);

router.put(
  "/restoreroom/:id",
  verifyToken,
  authorizeRole(["admin"]),
  restoreRoom
);

export default router;
