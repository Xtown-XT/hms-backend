import RoomService from "../room_service/room_service.model.js";
import Guest from "../frontoffice/model/guest.model.js";
import BaseService from "../../src/services/service.js";

const roomServiceService = new BaseService(RoomService);
const isAdmin = (req) => req.user && req.user.role === "admin";

// ---------------- CREATE ROOM SERVICE REQUEST ----------------
export const createRequest = async (req, res) => {
  try {
    const { guest_id, room_id, request_type, request_details } = req.body;

    // Fetch guest
    const guest = await Guest.findOne({ where: { id: guest_id, is_active: true } });
    if (!guest) return res.status(404).json({ error: "Guest not found or inactive" });

    // Parse booking_info JSON
    const bookingInfo = typeof guest.booking_info === "string" 
      ? JSON.parse(guest.booking_info) 
      : guest.booking_info;

    const guestRoomId = bookingInfo?.data?.room_id;

    if (!guestRoomId) return res.status(403).json({ error: "Guest has no room assigned" });
    if (String(guestRoomId) !== String(room_id)) 
      return res.status(403).json({ error: "This guest is not associated with the room." });

    const payload = { guest_id, room_id, request_type, request_details, is_active: true };
    const request = await roomServiceService.create(payload);

    return res.status(201).json({ message: "Request submitted successfully", data: request });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// ---------------- GET ALL REQUESTS ----------------
export const getAllRequests = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: "Admins only" });

    const { page = 1, limit = 10, orderBy = "created_at", order = "ASC" } = req.query;

    const result = await roomServiceService.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy,
      order: ['ASC','DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC',
      where: { is_active: true },
    });

    return res.status(200).json({
      message: "Requests retrieved successfully",
      total: result.count,
      page: parseInt(page),
      totalPages: result.totalPages,
      data: result.rows,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ---------------- GET REQUEST BY ID ----------------
export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await roomServiceService.getById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    if (!isAdmin(req) && request.guest_id !== req.user.id) 
      return res.status(403).json({ error: "Access denied" });

    return res.status(200).json({ message: "Request retrieved", data: request });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ---------------- UPDATE REQUEST ----------------
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // fields to update, e.g., { request_type, request_details, is_active }

    const request = await RoomService.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    await request.update(updates);

    return res.status(200).json({
      message: "Request updated successfully",
      data: request,  // updated data
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ---------------- DELETE REQUEST (Soft Delete) ----------------
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isAdmin(req)) return res.status(403).json({ error: "Admins only" });

    const request = await roomServiceService.getById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    await roomServiceService.update(id, { is_active: false });
    return res.status(200).json({ message: "Request deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ---------------- RESTORE REQUEST ----------------
export const restoreRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await RoomService.findByPk(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const updates = { ...req.body, is_active: true };
    await request.update(updates);

    return res.status(200).json({
      message: "Request restored successfully",
      data: request, 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  restoreRequest,
};
