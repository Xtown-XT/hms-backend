// src/modules/guest_feedback/guest_feedback.controller.js
import GuestFeedback from "./guest_feedback.model.js";
import Guest from "../frontoffice/model/guest.model.js";
import BaseService from "../services/service.js";

const guestFeedbackService = new BaseService(GuestFeedback);

const isAdmin = (req) => req.user?.role === "admin";

// Create Feedback
export const createFeedback = async (req, res) => {
  try {
    const { guest_id } = req.body;

    const guestExists = await Guest.findOne({
      where: { id: guest_id, is_active: true },
    });

    if (!guestExists)
      return res.status(404).json({ error: "Guest not found or inactive." });

    const payload = { ...req.body, created_by: req.user.id };
    const feedback = await guestFeedbackService.create(payload);

    res
      .status(201)
      .json({ message: "Feedback created successfully", data: feedback });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Feedbacks (Admin Only)
export const getAllFeedbacks = async (req, res) => {
  try {
    if (!isAdmin(req))
      return res.status(403).json({ message: "Access denied. Admins only." });

    const {
      includeInactive = false,
      page = 1,
      limit = 10,
      orderBy = "createdAt",
      order = "ASC",
    } = req.query;

    const result = await guestFeedbackService.getAll({
      includeInactive: includeInactive === "true",
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy,
      order: ["ASC", "DESC"].includes(order.toUpperCase())
        ? order.toUpperCase()
        : "ASC",
    });

    res.status(200).json({
      message: "Feedback retrieved successfully",
      total: result.count,
      page: parseInt(page),
      totalPages: result.totalPages,
      data: result.rows,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Feedback by ID
export const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await guestFeedbackService.getById(id);

    if (!feedback)
      return res.status(404).json({ message: "Feedback not found" });

    if (!isAdmin(req) && feedback.guest_id !== req.user.id)
      return res.status(403).json({ message: "Access denied." });

    res
      .status(200)
      .json({ message: "Feedback retrieved successfully", data: feedback });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Feedback
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await guestFeedbackService.getById(id);

    if (!feedback)
      return res.status(404).json({ message: "Feedback not found" });

    if (!isAdmin(req) && feedback.guest_id !== req.user.id)
      return res.status(403).json({ message: "Access denied." });

    const payload = { ...req.body, updated_by: req.user.id };
    const updatedFeedback = await guestFeedbackService.update(id, payload);

    res.status(200).json({
      message: "Feedback updated successfully",
      data: updatedFeedback,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Feedback (Admin Only)
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isAdmin(req))
      return res.status(403).json({ message: "Access denied." });

    const feedback = await guestFeedbackService.getById(id);

    if (!feedback)
      return res.status(404).json({ message: "Feedback not found" });

    await guestFeedbackService.delete(id);

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Restore Feedback
export const restoreFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isAdmin(req))
      return res.status(403).json({ message: "Access denied." });

    const feedback = await GuestFeedback.findByPk(id, { paranoid: false });

    if (!feedback)
      return res.status(404).json({ message: "Feedback not found" });

    if (feedback.deletedAt !== null) await feedback.restore();

    if (req.body && Object.keys(req.body).length > 0)
      await feedback.update(req.body);

    res
      .status(200)
      .json({ message: "Feedback restored successfully", data: feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  restoreFeedback,
};
