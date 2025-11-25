// src/modules/floor/floor.routes.js
import { Router } from "express";
import FloorController from "../controller/floor.controller.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

// Admin-only routes
router.get("/getfloors", verifyToken, authorizeRole(["admin"]), FloorController.getAllFloors);
router.get("/floor/:id", verifyToken, authorizeRole(["admin"]), FloorController.getFloorById);
router.post("/createfloor", verifyToken, authorizeRole(["admin"]), FloorController.createFloor);
router.put("/floor/:id", verifyToken, authorizeRole(["admin"]), FloorController.updateFloor);
router.delete("/deletefloor/:id", verifyToken, authorizeRole(["admin"]), FloorController.deleteFloor);
router.patch("/floor/restore/:id", verifyToken, authorizeRole(["admin"]), FloorController.restoreFloor);

export default router;
