import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  softDelete,
  restore,
} from "../controller/tax.controller.js";

import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = express.Router();

// 🔐 Only ADMIN can create/update/delete/restore taxes
router.post("/createtax", verifyToken, authorizeRole(["admin"]), create);
router.put("/updatetax/:id", verifyToken, authorizeRole(["admin"]), update);
router.delete("/deletetax/:id", verifyToken, authorizeRole(["admin"]), softDelete);
router.patch("/tax/:id/restore", verifyToken, authorizeRole(["admin"]), restore);

// 👀 Public/Authorized: view endpoints
router.get("/tax", verifyToken, getAll);
router.get("/tax/:id", verifyToken, getById);

export default router;