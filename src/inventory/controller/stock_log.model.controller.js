import StockLog from "../model/stock_log.model.js";
import InventoryItem from "../model/inventory_item.model.js";

/**
 * ✅ Create a new stock log entry for multiple items
 */
export const createStockLog = async (req, res) => {
  try {
    const { items, issued_by } = req.body;

    // Validate that items is an array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required" });
    }

    // Loop through each item and process
    for (let itemData of items) {
      const { item_id, transaction_type, quantity, remarks } = itemData;

      // Validate required fields for each item
      if (!item_id || !transaction_type || !quantity) {
        return res.status(400).json({ message: "Missing required fields in item data" });
      }

      const item = await InventoryItem.findByPk(item_id);
      if (!item) {
        return res.status(404).json({ message: `Inventory item with ID ${item_id} not found` });
      }

      // Update stock based on transaction type
      if (transaction_type === "IN") {
        item.quantity_in_stock += quantity;
      } else if (transaction_type === "OUT") {
        if (item.quantity_in_stock < quantity) {
          return res.status(400).json({ message: "Insufficient stock" });
        }
        item.quantity_in_stock -= quantity;
      }

      await item.save(); // Save updated item stock

      // Create stock log entry
      await StockLog.create({
        item_id,
        transaction_type,
        quantity,
        remarks,
        issued_by: issued_by || req.user?.id,  // Optional, defaults to logged-in user
      });
    }

    return res.status(201).json({
      message: "Stock logs created successfully",
    });
  } catch (error) {
    console.error("Error creating stock log:", error);
    res.status(500).json({ message: "Error creating stock log", error: error.message });
  }
};

/**
 * ✅ Get all stock logs (Admin only)
 */
export const getAllStockLogs = async (req, res) => {
  try {
    const logs = await StockLog.findAll({
      include: [
        {
          model: InventoryItem,
          as: "item",
          attributes: ["id", "item_name", "category", "unit"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("Error fetching stock logs:", error);
    res.status(500).json({ message: "Error fetching stock logs", error: error.message });
  }
};

/**
 * ✅ Get single stock log by ID (Admin only)
 */
export const getStockLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await StockLog.findByPk(id, {
      include: [{ model: InventoryItem, as: "item" }],
    });

    if (!log) {
      return res.status(404).json({ message: "Stock log not found" });
    }

    return res.status(200).json({ success: true, data: log });
  } catch (error) {
    console.error("Error fetching stock log:", error);
    res.status(500).json({ message: "Error fetching stock log", error: error.message });
  }
};


/**
 * ✅ PUT - Full Update Stock Log (Admin only)
 */
export const updateStockLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_id, transaction_type, quantity, room_id, remarks, issued_by } = req.body;

    const log = await StockLog.findByPk(id);
    if (!log) {
      return res.status(404).json({ message: "Stock log not found" });
    }

    // Full update (replace all fields)
    log.item_id = item_id || log.item_id;
    log.transaction_type = transaction_type || log.transaction_type;
    log.quantity = quantity || log.quantity;
    log.room_id = room_id || log.room_id;
    log.remarks = remarks || log.remarks;
    log.issued_by = issued_by || log.issued_by;

    await log.save();

    return res.status(200).json({
      message: "Stock log updated successfully",
      data: log,
    });
  } catch (error) {
    console.error("Error updating stock log:", error);
    return res.status(500).json({ message: "Error updating stock log", error: error.message });
  }
};

/**
 * ✅ Soft delete stock log (Admin only)
 * Marks the log as inactive by setting is_active to false
 */
export const deleteStockLog = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await StockLog.findByPk(id);
    if (!log) {
      return res.status(404).json({ message: "Stock log not found" });
    }

    // Soft delete the log by setting is_active to false
    await log.update({ is_active: false });

    return res.status(200).json({ message: "Stock log soft-deleted successfully" });
  } catch (error) {
    console.error("Error soft-deleting stock log:", error);
    res.status(500).json({ message: "Error soft-deleting stock log", error: error.message });
  }
};

export const restoreStockLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, issued_by, room_id, remarks } = req.body;

    const log = await StockLog.findOne({ where: { id } });

    if (!log) {
      return res.status(404).json({ message: "Stock log not found" });
    }

    // Restore if inactive
    if (log.is_active === false) {
      log.is_active = true;
    }

    // If items array exists, take the first one for this log
    if (Array.isArray(items) && items.length > 0) {
      const item = items[0]; // pick first since one log = one item
      log.item_id = item.item_id ?? log.item_id;
      log.transaction_type = item.transaction_type ?? log.transaction_type;
      log.quantity = item.quantity ?? log.quantity;
    }

    // Common fields
    log.issued_by = issued_by ?? log.issued_by;
    log.room_id = room_id ?? log.room_id;
    log.remarks = remarks ?? log.remarks;

    await log.save();

    return res.status(200).json({
      message: "Stock log restored and updated successfully",
      data: log,
    });
  } catch (error) {
    console.error("Error restoring and updating stock log:", error);
    res.status(500).json({
      message: "Error restoring and updating stock log",
      error: error.message,
    });
  }
};

export default {
  createStockLog,
  getAllStockLogs,
  getStockLogById,
  updateStockLog,
  deleteStockLog,
  restoreStockLog,  
};
