// src/modules/staff/routes/staff.routes.js

import { Router } from "express";
import StaffController from "../controller/staff.controller.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

// ---------------------- ADMIN-ONLY ROUTES ----------------------
router.get("/staff", verifyToken, authorizeRole(["admin"]), StaffController.getAllStaff);
router.get("/staff/:id", verifyToken, authorizeRole(["admin"]), StaffController.getStaffById);
router.post("/staff", verifyToken, authorizeRole(["admin"]), StaffController.createStaff);
router.put("/staff/:id", verifyToken, authorizeRole(["admin"]), StaffController.updateStaff);
router.delete("/staff/:id", verifyToken, authorizeRole(["admin"]), StaffController.deleteStaff);
router.patch("/staff/restore/:id", verifyToken, authorizeRole(["admin"]), StaffController.restoreStaff);

export default router;
