// src/hrms/controller/staff.controller.js

import BaseService from "../../services/service.js";
import Staff from "../model/staff.model.js";

const staffService = new BaseService(Staff);

// ------------------------ CHECK ADMIN ------------------------
const isAdmin = (req) => req.user && req.user.role === "admin";

// ------------------------ CREATE STAFF ------------------------
export const createStaff = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const payload = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const staff = await staffService.create(payload);

    return res.status(201).json({
      message: "Staff created successfully",
      data: staff,
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ------------------------ GET ALL STAFF ------------------------
export const getAllStaff = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await staffService.getAll({
      page: Number(page),
      limit: Number(limit),
      order: "DESC",
    });

    return res.status(200).json({
      message: "Staff fetched successfully",
      data: result,
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ------------------------ GET STAFF BY ID ------------------------
export const getStaffById = async (req, res) => {
  try {
    const staff = await staffService.getById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.status(200).json({
      message: "Staff found",
      data: staff,
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ------------------------ UPDATE STAFF ------------------------
export const updateStaff = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const payload = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const staff = await staffService.update(req.params.id, payload);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.status(200).json({
      message: "Staff updated successfully",
      data: staff,
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ------------------------ DELETE STAFF ------------------------
export const deleteStaff = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    await staffService.delete(req.params.id);

    return res.status(200).json({
      message: "Staff soft-deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ------------------------ RESTORE STAFF ------------------------
export const restoreStaff = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const staff = await Staff.findByPk(req.params.id, { paranoid: false });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (staff.deletedAt) {
      await staff.restore();
    }

    return res.status(200).json({
      message: "Staff restored successfully",
      data: staff,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  restoreStaff,
};
