import GuestFeedback from "../guest_feedback/guest_feedback.model.js";
import Guest from "../../src/frontoffice/model/guest.model.js"; 
import BaseService from "../../src/services/service.js";

const guestFeedbackService = new BaseService(GuestFeedback);

// Admin check helper
const isAdmin = (req) => req.user && req.user.role === "admin";

// Create guest feedback (Admins and users can create their own feedback)
export const createFeedback = async (req, res) => {
  try {
    const { guest_id } = req.body;
    const guestExists = await Guest.findOne({
      where: { id: guest_id, is_active: 1 },  
    });
    if (!guestExists) {
      return res.status(404).json({ error: "Guest not found or inactive. Please register or activate first." });
    }
    const payload = {
      ...req.body,
      guest_id: guest_id,  
    };
    const feedback = await guestFeedbackService.create(payload);
    return res.status(201).json({ message: "Feedback submitted successfully", data: feedback });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// Get all guest feedbacks with optional sorting
export const getAllFeedbacks = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ message: "Access denied. Admins only." });
    console.log("Request received:", req.query);
    const { includeInactive = false, page = 1, limit = 10, orderBy = "created_at", order = "ASC" } = req.query;
    const validOrderValues = ['ASC', 'DESC'];
    const orderDirection = validOrderValues.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';
    console.log("Using order:", orderDirection);  
    const result = await guestFeedbackService.getAll({
      includeInactive: includeInactive === "true",
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy: orderBy,
      order: orderDirection,  
    });

    return res.status(200).json({
      message: "Feedback retrieved successfully",
      total: result.count,
      page: parseInt(page),
      totalPages: result.totalPages,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ error: error.message });
  }
};

// Get specific feedback by ID (Admins and users can view their own feedback)
export const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await guestFeedbackService.getById(id);

    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    if (feedback.guest_id !== req.user.id && !isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. You can only view your own feedback." });
    }
    return res.status(200).json({ message: "Feedback retrieved successfully", data: feedback });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Update guest feedback (Users can only update their own feedback, Admins can update any feedback)
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await guestFeedbackService.getById(id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    if (feedback.guest_id !== req.user.id && !isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. You can only edit your own feedback." });
    }
    const payload = {
      ...req.body,
      updated_by: req.user.id,  
    };
    const updatedFeedback = await guestFeedbackService.update(id, payload);
    return res.status(200).json({ message: "Feedback updated successfully", data: updatedFeedback });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete guest feedback (Admins only)
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isAdmin(req)) return res.status(403).json({ message: "Access denied. Admins only." });
    const feedback = await guestFeedbackService.getById(id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    await guestFeedbackService.delete(id);
    return res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Restore Guest Feedback (Admins only)
export const restoreFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const feedback = await GuestFeedback.findByPk(id, { paranoid: false });
    
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    if (feedback.deletedAt !== null) {
      await feedback.restore();
    }

    const updates = req.body || {};
    if (Object.keys(updates).length > 0) {
      await feedback.update(updates);
    }
    return res.status(200).json({
      message: "Feedback restored and updated successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Restore Feedback Error:", error);
    return res.status(500).json({ error: error.message });
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
