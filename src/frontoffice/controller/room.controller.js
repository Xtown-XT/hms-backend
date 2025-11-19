// src/modules/room/controller/room.controller.js
import Room from "../model/room.model.js";
import Floor from "../model/floor.model.js";
import BaseService from "../../services/service.js";

import {
  createRoomSchema,
  updateRoomSchema,
  getRoomsQuerySchema
} from "../dto/room.dto.js";

const roomService = new BaseService(Room);

const isAdmin = (req) => req.user?.role === "admin";

// ---------------------------- CREATE ROOM ----------------------------
export const createRoom = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.sendError("Admins only", 403);

    const validated = createRoomSchema.parse(req.body);

    const floor = await Floor.findByPk(validated.floor_id);
    if (!floor) return res.sendError("Invalid floor_id", 400);

    const payload = {
      ...validated,
      created_by: req.user.id,
    };

    const room = await roomService.create(payload);
    return res.sendSuccess(room, "Room created successfully", 201);
  } catch (error) {
    return res.sendError(error.message, 400);
  }
};

// ---------------------------- GET ALL ROOMS ----------------------------
// export const getAllRooms = async (req, res) => {
//   try {
//     const query = getRoomsQuerySchema.parse(req.query);

//     const result = await roomService.getAll({
//       page: Number(query.page || 1),
//       limit: Number(query.limit || 10),
//       filters: query.floor_id ? { floor_id: query.floor_id } : {},
//       order: "DESC",
//     });

//     return res.sendSuccess(result, "Rooms retrieved successfully");
//   } catch (error) {
//     return res.sendError(error.message, 400);
//   }
// };

export const getAllRooms = async (req, res) => {
  try {
    const query = getRoomsQuerySchema.parse(req.query);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const offset = (page - 1) * limit;

    // Custom query to avoid BaseService auto-filters (like is_active)
    const rooms = await Room.findAndCountAll({
      where: query.floor_id ? { floor_id: query.floor_id } : {},
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.sendSuccess(
      {
        total: rooms.count,
        page,
        limit,
        pages: Math.ceil(rooms.count / limit),
        data: rooms.rows,
      },
      "Rooms retrieved successfully"
    );
  } catch (error) {
    return res.sendError(error.message, 400);
  }
};


// ---------------------------- GET ROOM BY ID ----------------------------
export const getRoomById = async (req, res) => {
  try {
    const room = await roomService.getById(req.params.id);
    if (!room) return res.sendError("Room not found", 404);

    return res.sendSuccess(room, "Room found");
  } catch (error) {
    return res.sendError(error.message, 400);
  }
};

// ---------------------------- UPDATE ROOM ----------------------------
export const updateRoom = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.sendError("Admins only", 403);

    const validated = updateRoomSchema.parse(req.body);

    if (validated.floor_id) {
      const floor = await Floor.findByPk(validated.floor_id);
      if (!floor) return res.sendError("Invalid floor_id", 400);
    }

    const payload = {
      ...validated,
      updated_by: req.user.id,
    };

    const room = await roomService.update(req.params.id, payload);
    if (!room) return res.sendError("Room not found", 404);

    return res.sendSuccess(room, "Room updated successfully");
  } catch (error) {
    return res.sendError(error.message, 400);
  }
};

// ---------------------------- DELETE ROOM ----------------------------
export const deleteRoom = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.sendError("Admins only", 403);

    await roomService.delete(req.params.id);
    return res.sendSuccess(null, "Room soft-deleted successfully");
  } catch (error) {
    return res.sendError(error.message, 400);
  }
};

// ---------------------------- RESTORE ROOM ----------------------------
export const restoreRoom = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.sendError("Admins only", 403);

    const room = await Room.findByPk(req.params.id, { paranoid: false });
    if (!room) return res.sendError("Room not found", 404);

    if (room.deletedAt) await room.restore();

    return res.sendSuccess(room, "Room restored successfully");
  } catch (error) {
    return res.sendError(error.message, 400);
  }
};

export default {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  restoreRoom,
};
