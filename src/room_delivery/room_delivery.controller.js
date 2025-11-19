import RoomDelivery from "../room_delivery/room_delivery.model.js";
import Room from "../frontoffice/model/room.model.js";
import Guest from "../frontoffice/model/guest.model.js";
import Order from "../order/models/order.models.js";
import BaseService from "../../src/services/service.js";

const roomDeliveryService = new BaseService(RoomDelivery);
const isAdmin = (req) => req.user && req.user.role === "admin";

// ---------------- CREATE ROOM DELIVERY ----------------
export const createDelivery = async (req, res) => {
  try {
    const { order_id, room_id, guest_id, status, item_check } = req.body;
    const user = req.user;

    const guest = await Guest.findByPk(guest_id);
    const room = await Room.findByPk(room_id);
    const order = await Order.findByPk(order_id);

    if (!guest || !room || !order) {
      return res.status(404).json({ message: "Guest, Room, or Order not found" });
    }

    // Create room delivery
    const delivery = await RoomDelivery.create({
      order_id,
      room_id,
      guest_id,
      status: status || "PENDING", 
      item_check: item_check || false,
      created_by: user.id, 
    });

    return res.status(201).json({
      message: "Room delivery created successfully",
      data: delivery,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// ---------------- GET ALL ROOM DELIVERIES ----------------
export const getAllDeliveries = async (req, res) => {
  try {
    const { page = 1, limit = 10, orderBy = "created_at", order = "ASC" } = req.query;

    const validColumns = ['created_at', 'updated_at', 'status', 'room_id'];
    if (typeof orderBy !== 'string' || !validColumns.includes(orderBy)) {
      return res.status(400).json({ message: "Invalid column for ordering" });
    }

    const validOrderDirections = ['ASC', 'DESC'];
    const orderDirection = validOrderDirections.includes(order) ? order : 'ASC'; 

    const deliveries = await RoomDelivery.findAndCountAll({
      where: { is_active: true },
      order: [[orderBy, orderDirection]],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    return res.status(200).json({
      message: "Room deliveries fetched successfully",
      total: deliveries.count,
      page: parseInt(page),
      totalPages: Math.ceil(deliveries.count / limit),
      data: deliveries.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// ---------------- GET ROOM DELIVERY BY ID ----------------
export const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await RoomDelivery.findByPk(id);

    if (!delivery) {
      return res.status(404).json({ message: "Room delivery not found" });
    }

    if (req.user.role !== 'admin' && delivery.guest_id !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({ message: "Room delivery fetched successfully", data: delivery });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ---------------- UPDATE ROOM DELIVERY ----------------
export const updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, item_check } = req.body;

    if (!status && item_check === undefined) {
      return res.status(400).json({ message: "No data to update" });
    }

    const delivery = await RoomDelivery.findByPk(id);
    if (!delivery) {
      return res.status(404).json({ message: "Room delivery not found" });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can update deliveries" });
    }

    await delivery.update({ status, item_check });
    return res.status(200).json({ message: "Room delivery updated", data: delivery });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ---------------- DELETE ROOM DELIVERY (Soft Delete) ----------------
export const deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can delete deliveries" });
    }

    const delivery = await RoomDelivery.findByPk(id);
    if (!delivery) {
      return res.status(404).json({ message: "Room delivery not found" });
    }

    await delivery.destroy();

    return res.status(200).json({ message: "Room delivery deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// ---------------- RESTORE ROOM DELIVERY AND UPDATE ----------------
export const restoreDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active, updatedBy, status, item_check } = req.body;  

    const delivery = await RoomDelivery.findByPk(id, { paranoid: false });

    if (!delivery) {
      return res.status(404).json({ message: "Room delivery not found" });
    }

    if (!delivery.deleted_at) {
      return res.status(400).json({ message: "This delivery is not deleted" });
    }

    await delivery.restore();

    const updatedDelivery = await delivery.update({
      is_active: is_active !== undefined ? is_active : true,  
      updatedBy: updatedBy || delivery.updatedBy,  
      status: status || delivery.status,  
      item_check: item_check !== undefined ? item_check : delivery.item_check,  
    });

    return res.status(200).json({
      message: "Room delivery restored and updated successfully",
      data: updatedDelivery,
    });
  } catch (error) {
    console.error("Error in restoring and updating delivery:", error);
    return res.status(500).json({ error: error.message || "Failed to restore and update delivery" });
  }
};


export default {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  restoreDelivery,
};
