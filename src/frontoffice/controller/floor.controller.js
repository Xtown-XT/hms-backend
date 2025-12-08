import BaseService from "../../services/service.js";
import Floor from "../model/floor.model.js";

import {
  createFloorSchema,
  updateFloorSchema,
  deleteFloorSchema
} from "../dto/floor.dto.js";

const floorService = new BaseService(Floor);

// ---------------------- ADMIN CHECK ----------------------
const isAdmin = (req) => req.user?.role === "admin";

// ---------------------- CREATE FLOOR ----------------------
export const createFloor = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admins only."
      });
    }

    const parsed = createFloorSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: parsed.error.errors.map(e => ({
          path: e.path.join("."),
          message: e.message,
        }))
      });
    }

    const payload = {
      ...parsed.data,
      created_by: req.user?.id || null,
    };

    const floor = await floorService.create(payload);

    return res.status(201).json({
      status: "success",
      message: "Floor created successfully",
      data: floor,
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ---------------------- GET ALL FLOORS ----------------------
export const getAllFloors = async (req, res) => {
  try {
    const { page = 1, limit = 10, order = "ASC" } = req.query;

    const result = await floorService.getAll({
      page: Number(page),
      limit: Number(limit),
      orderBy: "createdAt", // 🔥 FIXED
      order: order.toUpperCase(),
    });

    return res.status(200).json({
      status: "success",
      message: "Floors fetched successfully",
      total: result.count,
      page: Number(page),
      totalPages: result.totalPages,
      data: result.rows,
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ---------------------- GET BY ID ----------------------
export const getFloorById = async (req, res) => {
  try {
    const { id } = req.params;

    const floor = await floorService.getById(id);
    if (!floor) {
      return res.status(404).json({
        status: "error",
        message: "Floor not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Floor retrieved successfully",
      data: floor,
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ---------------------- UPDATE FLOOR ----------------------
export const updateFloor = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admins only."
      });
    }

    const parsed = updateFloorSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: parsed.error.errors.map(e => ({
          path: e.path.join("."),
          message: e.message,
        }))
      });
    }

    const payload = {
      ...parsed.data,
      updated_by: req.user?.id || null,
    };

    const updated = await floorService.update(req.params.id, payload);

    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Floor not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Floor updated successfully",
      data: updated,
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ---------------------- SOFT DELETE ----------------------
export const deleteFloor = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admins only."
      });
    }

    const parsed = deleteFloorSchema.safeParse(req.body || {});

    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: parsed.error.errors
      });
    }

    await floorService.delete(req.params.id);

    return res.status(200).json({
      status: "success",
      message: "Floor soft-deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ---------------------- RESTORE FLOOR ----------------------
export const restoreFloor = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admins only."
      });
    }

    const floor = await Floor.findByPk(req.params.id, { paranoid: false });

    if (!floor) {
      return res.status(404).json({
        status: "error",
        message: "Floor not found"
      });
    }

    if (floor.deletedAt) await floor.restore();

    return res.status(200).json({
      status: "success",
      message: "Floor restored successfully",
      data: floor,
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ---------------------- EXPORT CONTROLLER ----------------------
export default {
  createFloor,
  getAllFloors,
  getFloorById,
  updateFloor,
  deleteFloor,
  restoreFloor,
};
