// import { ZodError } from "zod";
// import * as orderItemService from "../service/order_items.service.js";
// import { createOrderItemsBulkSchema, updateOrderItemSchema } from "../dto/order_items.dto.js";

// // Create bulk order items
// export async function createOrderItemsBulkController(req, res) {
//   try {
//     const validatedData = createOrderItemsBulkSchema.parse(req.body);
//     const items = await orderItemService.createOrderItemsBulkService(validatedData);
//     res.status(201).json({ message: "Order items created successfully", items });
//   } catch (err) {
//     if (err instanceof ZodError) return res.status(400).json({ error: err.errors });
//     res.status(400).json({ error: err.message });
//   }
// }

// // Get all order items (optionally by order_id)
// export async function getAllOrderItemsController(req, res) {
//   try {
//     const filter = {};
//     if (req.query.order_id) filter.order_id = req.query.order_id;
//     const items = await orderItemService.getAllOrderItemsService(filter);
//     res.status(200).json({ items });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// }

// // Get order item by ID
// export async function getOrderItemByIdController(req, res) {
//   try {
//     const item = await orderItemService.getOrderItemByIdService(req.params.id);
//     if (!item) return res.status(404).json({ error: "Order item not found" });
//     res.status(200).json({ item });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// }

// // Update order item
// export async function updateOrderItemController(req, res) {
//   try {
//     const validatedData = updateOrderItemSchema.parse(req.body);
//     const item = await orderItemService.updateOrderItemService(req.params.id, validatedData);
//     res.status(200).json({ message: "Order item updated successfully", item });
//   } catch (err) {
//     if (err instanceof ZodError) return res.status(400).json({ error: err.errors });
//     res.status(400).json({ error: err.message });
//   }
// }

// // Delete order item
// export async function deleteOrderItemController(req, res) {
//   try {
//     const result = await orderItemService.deleteOrderItemService(req.params.id);
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// }

import BaseService from "../../services/service.js";
import OrderItem from "../models/order_items.models.js";
import { createOrderItemSchema, updateOrderItemSchema, deleteOrderItemSchema } from "../dto/order_items.dto.js";
import Order from "../models/order.models.js";
import MealItem from "../../digital_menu/model/meal_item.model.js"; 

const orderItemService = new BaseService(OrderItem);

// Utility: Role check helpers
const isAdmin = (user) => user.role === "admin";
const isStaff = (user) => user.role === "staff";
const isUser = (user) => user.role === "user";

// ✅ CREATE ORDER ITEM (Admin and User only)
export const createOrderItem = async (req, res) => {
  try {
    const validatedData = createOrderItemSchema.parse(req.body);
    const user = req.user;

    // ❌ Prevent staff from creating order items
    if (isStaff(user)) {
      return res.status(403).json({ message: "Staff cannot create order items" });
    }

    // Ensure the order exists and is not deleted
    const order = await Order.findOne({
      where: { id: validatedData.order_id, is_active: true }, // Check if order is active
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found or is deleted" });
    }

    // Ensure the menu item exists
    const mealItem = await MealItem.findByPk(validatedData.meal_item_id); // Corrected to MealItem
    if (!mealItem) {
      return res.status(404).json({ message: "Meal item not found" });
    }

    // Create order item
    const orderItem = await orderItemService.create({
      ...validatedData,
      created_by: user.id,
    });

    return res.status(201).json({
      message: "Order item created successfully",
      data: orderItem,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ GET ALL ORDER ITEMS (Admin and User only)
export const getAllOrderItems = async (req, res) => {
  try {
    const user = req.user;
    const { order_id } = req.query;
    let filter = {};

    if (isStaff(user)) {
      // Staff can see all order items they created
      filter = { created_by: user.id };
    } else if (isUser(user)) {
      // User can only see their order items
      filter = { created_by: user.id };
    }

    if (order_id) {
      filter.order_id = order_id; // Filter by specific order
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await orderItemService.getAll({
      where: filter,
      page,
      limit,
      orderBy: req.query.orderBy || "createdAt",
      order: req.query.order || "desc",
    });

    return res.status(200).json({
      message: "Order items fetched successfully",
      total: result.count,
      page,
      totalPages: Math.ceil(result.count / limit),
      data: result.rows,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ GET ORDER ITEM BY ID (Admin and User with proper permissions)
export const getOrderItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const orderItem = await orderItemService.getById(id);
    if (!orderItem) return res.status(404).json({ message: "Order item not found" });

    // Check permissions
    if (
      (isStaff(user) && orderItem.created_by !== user.id) ||
      (isUser(user) && orderItem.created_by !== user.id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({
      message: "Order item fetched successfully",
      data: orderItem,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ UPDATE ORDER ITEM (Admin only)
export const updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateOrderItemSchema.parse(req.body);
    const user = req.user;

    const orderItem = await orderItemService.getById(id);
    if (!orderItem) return res.status(404).json({ message: "Order item not found" });

    // ❌ Prevent staff and users from updating order items
    if (isUser(user) || isStaff(user)) {
      return res.status(403).json({ message: "Only admin can update order items" });
    }

    validatedData.updated_by = user.id;

    const updatedOrderItem = await orderItemService.update(id, validatedData);
    return res.status(200).json({
      message: "Order item updated successfully",
      data: updatedOrderItem,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ DELETE ORDER ITEM (Admin only)
export const deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isAdmin(user)) {
      return res.status(403).json({ message: "Only admin can delete order items" });
    }

    const validatedDelete = deleteOrderItemSchema.parse(req.body);
    const orderItem = await orderItemService.delete(id, validatedDelete);

    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    return res.status(200).json({ message: "Order item soft-deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const restoreOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can restore order items" });
    }

    // Include soft-deleted items
    const orderItem = await OrderItem.findByPk(id, { paranoid: false });
    if (!orderItem) return res.status(404).json({ message: "Order item not found" });

    // Restore soft-deleted item
    if (orderItem.deleted_at) await orderItem.restore();

    // Optional updates
    const updates = req.body || {};
    const allowedFields = ["quantity", "price", "special_request"];
    const updateData = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) updateData[key] = updates[key];
    }

    if (Object.keys(updateData).length > 0) {
      await orderItem.update(updateData);
      await orderItem.reload();
    }

    return res.status(200).json({
      message: "Order item restored successfully",
      data: orderItem,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
  restoreOrderItem,
};
