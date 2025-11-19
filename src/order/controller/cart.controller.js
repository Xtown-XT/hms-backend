import BaseService from "../../services/service.js";
import Cart from "../models/cart.models.js";
import { createCartSchema, updateCartSchema, deleteCartSchema } from "../dto/cart.dto.js";
import Guest from "../../frontoffice/model/guest.model.js";
import MealItem from "../../digital_menu/model/meal_item.model.js";

// Cart Service to interact with Cart model
const cartService = new BaseService(Cart);

// Utility: Role check helpers
const isAdmin = (user) => user.role === "admin";
const isStaff = (user) => user.role === "staff";
const isUser = (user) => user.role === "user";

// ✅ CREATE CART (only Admin & User)
export const createCart = async (req, res) => {
  try {
    // Validate incoming data with Zod
    const validatedData = createCartSchema.parse(req.body);
    const user = req.user;

    // Ensure staff cannot create carts
    if (isStaff(user)) {
      return res.status(403).json({ message: "Staff cannot create carts" });
    }

    // Validate if meal_item_id exists
    const mealItem = await MealItem.findByPk(validatedData.meal_item_id);
    if (!mealItem) {
      return res.status(400).json({ message: "Invalid meal_item_id" });
    }

    // Proceed with creating the cart
    const cart = await cartService.create({
      ...validatedData,
      created_by: user.id,
    });

    return res.status(201).json({
      message: "Cart created successfully",
      data: cart,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ GET ALL CARTS (Unchanged for Admin & User)
export const getAllCarts = async (req, res) => {
  try {
    const user = req.user;
    let filter = {};

    if (isStaff(user)) {
      // Staff see carts they created
      filter = { created_by: user.id };
    } else if (isUser(user)) {
      // User sees only their own guest carts
      const guest = await Guest.findOne({ where: { user_id: user.id } });
      if (!guest) {
        return res.status(404).json({ message: "Guest profile not found" });
      }
      filter = { guest_id: guest.id };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await cartService.getAll({
      where: filter,
      page,
      limit,
      orderBy: req.query.orderBy || "created_at",
      order: req.query.order || "desc",
    });

    return res.status(200).json({
      message: "Carts fetched successfully",
      total: result.count,
      page,
      totalPages: Math.ceil(result.count / limit),
      data: result.rows,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ GET CART BY ID (Unchanged for Admin & User)
export const getCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const cart = await cartService.getById(id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Access check based on roles
    if (
      (isStaff(user) && cart.created_by !== user.id) ||
      (isUser(user) && cart.guest_id !== user.id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ UPDATE CART (only Admin)
export const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateCartSchema.parse(req.body);
    const user = req.user;

    const cart = await cartService.getById(id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Prevent staff and users from updating carts
    if (isUser(user) || isStaff(user)) {
      return res.status(403).json({ message: "Only admin can update carts" });
    }

    // Validate if meal_item_id exists before update
    if (validatedData.meal_item_id) {
      const mealItem = await MealItem.findByPk(validatedData.meal_item_id);
      if (!mealItem) {
        return res.status(400).json({ message: "Invalid meal_item_id" });
      }
    }

    validatedData.updated_by = user.id;

    const updatedCart = await cartService.update(id, validatedData);
    return res.status(200).json({
      message: "Cart updated successfully",
      data: updatedCart,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(400).json({ error: error.message });
  }
};

// ✅ DELETE CART (Admin only)
export const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isAdmin(user)) {
      return res.status(403).json({ message: "Only admin can delete carts" });
    }

    const validatedDelete = deleteCartSchema.parse(req.body);
    const cart = await cartService.delete(id, validatedDelete);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({ message: "Cart soft-deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ RESTORE CART (Admin only)
export const restoreCart = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isAdmin(user)) {
      return res.status(403).json({ message: "Only admin can restore carts" });
    }

    // Include soft-deleted carts
    const cart = await Cart.findByPk(id, { paranoid: false });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Restore if soft-deleted
    if (cart.deleted_at) await cart.restore();

    // Optional updates from request body
    const updates = req.body || {};
    const allowedFields = ["status", "total_amount", "notes", "quantity", "price", "meal_item_id", "room_id", "guest_id"];
    const updateData = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) updateData[key] = updates[key];
    }

    if (Object.keys(updateData).length > 0) {
      await cart.update(updateData);
      await cart.reload();
    }

    return res.status(200).json({
      message: "Cart restored successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export default {
  createCart,
  getAllCarts,
  getCartById,
  updateCart,
  deleteCart,
  restoreCart,
};
