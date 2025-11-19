import { Router } from "express";
import * as InventoryItemController from "../../inventory/controller/inventory_item.controller.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

// ✅ Create a new inventory item (Admin only)
router.post(
  "/inventory-item",
  verifyToken,
  authorizeRole(["admin"]),
  InventoryItemController.createItem
);

// ✅ Get all inventory items (Admin only)
router.get(
  "/inventory-items",
  verifyToken,
  authorizeRole(["admin"]),
  InventoryItemController.getAllItems
);

// ✅ Get inventory item by ID (Admin only)
router.get(
  "/inventory-item/:id",
  verifyToken,
  authorizeRole(["admin"]),
  InventoryItemController.getItemById
);

// ✅ Update inventory item (Admin only)
router.put(
  "/inventory-item/:id",
  verifyToken,
  authorizeRole(["admin"]),
  InventoryItemController.updateItem
);

// ✅ Soft delete inventory item (Admin only)
router.delete(
  "/inventory-item/:id",
  verifyToken,
  authorizeRole(["admin"]),
  InventoryItemController.deleteItem
);

// ✅ Restore deleted inventory item (Admin only)
router.patch(
  "/inventory-item/restore/:id",
  verifyToken,
  authorizeRole(["admin"]),
  InventoryItemController.restoreItem
);

export default router;
