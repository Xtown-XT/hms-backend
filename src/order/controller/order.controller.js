// import orderService from '../service/order.service.js';
// import { createOrderSchema, updateOrderStatusSchema, addOrderItemSchema } from '../dto/order.dto.js';

// class OrderController {
//   // Create 
//   async createOrder(req, res) {
//     try {
//       const validatedData = createOrderSchema.parse(req.body);
//       const order = await orderService.createOrder(validatedData);
//       return res.status(201).json(order);
//     } catch (error) {
//       if (error.name === 'ZodError') {
//         return res.status(400).json({ errors: error.errors });
//       }
//       return res.status(400).json({ error: error.message });
//     }
//   }

//   // Get all orders
// async getAllOrders(req, res) {
//   try {
//     const {
//       status,
//       includeInactive = false,
//       search,
//       page = 1,
//       limit = 10,
//       orderBy = "createdAt",
//       order = "asc",
//     } = req.query;

//     const orders = await orderService.getAllOrders({
//       status,
//       includeInactive: includeInactive === "true",                                                
//       search,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       orderBy,
//       order,
//     });

//     return res.json(orders);
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// }

//   // Get a single order by ID
//   async getOrderById(req, res) {
//     try {
//       const { id } = req.params;
//       const order = await orderService.getOrderById(id);
//       return res.json(order);
//     } catch (error) {
//       return res.status(404).json({ error: error.message });
//     }
//   }

//   async getDailyReport(req, res) {
//     try {
//       const { date } = req.query; 
//       const report = await orderService.getDailyItemSummary(date);
//       return res.status(200).json({
//         success: true,
//         data: report
//       });
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   }


//   // Update order status
//   async updateOrderStatus(req, res) {
//     try {
//       const validatedData = updateOrderStatusSchema.parse(req.body); 
//       const { id } = req.params;
//       const order = await orderService.updateOrderStatus(id, validatedData.status);
//       return res.json(order);
//     } catch (error) {
//       if (error.name === 'ZodError') {
//         return res.status(400).json({ errors: error.errors });
//       }
//       return res.status(400).json({ error: error.message });
//     }
//   }

//   // Soft delete order
//   async deleteOrder(req, res) {
//     try {
//       const { id } = req.params;
//       const result = await orderService.deleteOrder(id);
//       return res.json(result);
//     } catch (error) {
//       return res.status(404).json({ error: error.message });
//     }
//   }

//   // Add item to an existing order
//   async addItem(req, res) {
//     try {
//       const validatedData = addOrderItemSchema.parse(req.body); 
//       const { id } = req.params;
//       const item = await orderService.addItemToOrder(id, validatedData);
//       return res.status(201).json(item);
//     } catch (error) {
//       if (error.name === 'ZodError') {
//         return res.status(400).json({ errors: error.errors });
//       }
//       return res.status(400).json({ error: error.message });
//     }
//   }
// }

// export default new OrderController();




import BaseService from "../../services/service.js";
import Order from "../models/order.models.js";
import { createOrderSchema, updateOrderSchema, deleteOrderSchema } from "../dto/order.dto.js";
import Guest from "../../frontoffice/model/guest.model.js";

const orderService = new BaseService(Order);

// Utility: Role check helpers
const isAdmin = (user) => user.role === "admin";
const isStaff = (user) => user.role === "staff";
const isUser = (user) => user.role === "user";

// ✅ CREATE ORDER (only Admin & User)
export const createOrder = async (req, res) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const user = req.user;

    // ❌ Prevent staff from creating orders
    if (isStaff(user)) {
      return res.status(403).json({ message: "Staff cannot create orders" });
    }

    const order = await orderService.create({
      ...validatedData,
      created_by: user.id,
    });

    return res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ GET ALL ORDERS (unchanged)
export const getAllOrders = async (req, res) => {
  try {
    const user = req.user;
    let filter = {};

    if (isStaff(user)) {
      // Staff see orders they created
      filter = { created_by: user.id };
    } else if (isUser(user)) {
      // User sees only their own guest orders
      const guest = await Guest.findOne({ where: { user_id: user.id } });
      if (!guest) {
        return res.status(404).json({ message: "Guest profile not found" });
      }
      filter = { guest_id: guest.id };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await orderService.getAll({
      where: filter,
      page,
      limit,
      orderBy: req.query.orderBy || "created_at",
      order: req.query.order || "desc",
    });

    return res.status(200).json({
      message: "Orders fetched successfully",
      total: result.count,
      page,
      totalPages: Math.ceil(result.count / limit),
      data: result.rows,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ GET BY ID (unchanged)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const order = await orderService.getById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      (isStaff(user) && order.created_by !== user.id) ||
      (isUser(user) && order.guest_id !== user.id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ UPDATE ORDER (only Admin)
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateOrderSchema.parse(req.body);
    const user = req.user;

    const order = await orderService.getById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ❌ Prevent staff and users from updating orders
    if (isUser(user) || isStaff(user)) {
      return res.status(403).json({ message: "Only admin can update orders" });
    }

    validatedData.updated_by = user.id;

    const updatedOrder = await orderService.update(id, validatedData);
    return res.status(200).json({
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ DELETE ORDER (Admin only, unchanged)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isAdmin(user)) {
      return res.status(403).json({ message: "Only admin can delete orders" });
    }

    const validatedDelete = deleteOrderSchema.parse(req.body);
    const order = await orderService.delete(id, validatedDelete);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order soft-deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const restoreOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isAdmin(user)) {
      return res.status(403).json({ message: "Only admin can restore orders" });
    }

    const trimmedId = id.trim();

    let order = await Order.findByPk(trimmedId, { paranoid: false });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.deletedAt) {
      await order.restore();
    }

    const updates = req.body || {};
    const allowedFields = ["status", "total_amount", "notes", "payment_status"]; 
    const updateData = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) updateData[key] = updates[key];
    }

    if (Object.keys(updateData).length > 0) {
      await order.update(updateData);
      await order.reload(); 
    }

    return res.status(200).json({
      message: "Order restored successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export default {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  restoreOrder,
};
