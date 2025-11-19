import { Router } from "express";
import * as StockLogController from "../controller/stock_log.model.controller.js";  
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

// ✅ Create stock log (Admin only)
router.post(
  "/stock-log",
  verifyToken,
  authorizeRole(["admin"]),
  StockLogController.createStockLog
);

// ✅ Get all stock logs (Admin only)
router.get(
  "/stock-logs",
  verifyToken,
  authorizeRole(["admin"]),
  StockLogController.getAllStockLogs
);

// ✅ Get stock log by ID (Admin only)
router.get(
  "/stock-log/:id",
  verifyToken,
  authorizeRole(["admin"]),
  StockLogController.getStockLogById
);

// ✅ Full update stock log (Admin only) - PUT
router.put(
  "/stock-log/:id",
  verifyToken,
  authorizeRole(["admin"]),
  StockLogController.updateStockLog  
);

// ✅ Delete stock log (Admin only)
router.delete(
  "/stock-log/:id",
  verifyToken,
  authorizeRole(["admin"]),
  StockLogController.deleteStockLog
);

// ✅ Restore and update stock log (Admin only) - PATCH
router.patch(
  "/stock-log/restore/:id",
  verifyToken,
  authorizeRole(["admin"]),
  StockLogController.restoreStockLog  
);

export default router;
