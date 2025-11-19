import InventoryItem from "../../inventory/model/inventory_item.model.js";
import BaseService from "../../services/service.js";

const inventoryService = new BaseService(InventoryItem);

// Admin-only helper
const isAdmin = (req) => req.user && req.user.role === "admin";

// ------------------ CREATE INVENTORY ITEM ------------------
export const createItem = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const payload = {
      ...req.body,
      created_by: req.user.id,
    };

    const item = await inventoryService.create(payload);
    return res.status(201).json({
      message: "Inventory item created successfully",
      data: item,
    });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return res.status(400).json({ error: error.message });
  }
};

// ------------------ GET ALL INVENTORY ITEMS ------------------
export const getAllItems = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { includeInactive = false, page = 1, limit = 10, orderBy = "createdAt", order = "DESC" } = req.query;

    const result = await inventoryService.getAll({
      includeInactive: includeInactive === "true",
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy,
      order: order.toUpperCase() === "ASC" ? "ASC" : "DESC",
    });

    return res.status(200).json({
      message: "Inventory items retrieved successfully",
      total: result.count,
      page: parseInt(page),
      totalPages: result.totalPages,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return res.status(400).json({ error: error.message });
  }
};

// ------------------ GET ITEM BY ID ------------------
export const getItemById = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { id } = req.params;
    const item = await inventoryService.getById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({
      message: "Item retrieved successfully",
      data: item,
    });
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    return res.status(400).json({ error: error.message });
  }
};

// ------------------ UPDATE INVENTORY ITEM ------------------
export const updateItem = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { id } = req.params;
    const existing = await inventoryService.getById(id);

    if (!existing) {
      return res.status(404).json({ message: "Item not found" });
    }

    const payload = {
      ...req.body,
      updated_by: req.user.id,
    };

    const updated = await inventoryService.update(id, payload);
    return res.status(200).json({
      message: "Inventory item updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return res.status(400).json({ error: error.message });
  }
};

// ------------------ SOFT DELETE INVENTORY ITEM ------------------
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await InventoryItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.update({ is_active: false });

    return res.status(200).json({ message: "Item soft-deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({ error: error.message });
  }
};


// ------------------ RESTORE & UPDATE INVENTORY ITEM ------------------
export const restoreItem = async (req, res) => {
  try {
    // Only admins allowed
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { id } = req.params;
    const updateData = req.body; // New data coming from request body

    // Find item (even if inactive)
    const item = await InventoryItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // If item was soft deleted, restore it
    if (!item.is_active) {
      item.is_active = true;
    }

    // Update the item with new data
    await item.update({
      ...updateData,
      updated_by: req.user.id,
      updatedAt: new Date(),
    });

    return res.status(200).json({
      message: "Inventory item restored and updated successfully",
      data: item,
    });
  } catch (error) {
    console.error("Error restoring and updating inventory item:", error);
    return res.status(500).json({ error: error.message });
  }
};



export default {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  restoreItem,
};
