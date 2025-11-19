// src/modules/guest_feedback/guest_feedback.routes.js
import { Router } from "express";
import GuestFeedbackController from "./guest_feedback.controller.js";
import { verifyToken, authorizeRole } from "../middleware/index.js";

const router = Router();

router.get(
  "/feedbacks",
  verifyToken,
  authorizeRole(["admin"]),
  GuestFeedbackController.getAllFeedbacks
);

router.get(
  "/feedback/:id",
  verifyToken,
  authorizeRole(["admin", "user"]),
  GuestFeedbackController.getFeedbackById
);

router.post(
  "/createfeedback",
  verifyToken,
  authorizeRole(["admin", "user"]),
  GuestFeedbackController.createFeedback
);

router.put(
  "/feedback/:id",
  verifyToken,
  authorizeRole(["admin", "user"]),
  GuestFeedbackController.updateFeedback
);

router.delete(
  "/deletefeedback/:id",
  verifyToken,
  authorizeRole(["admin"]),
  GuestFeedbackController.deleteFeedback
);

router.patch(
  "/guest-feedback/restore/:id",
  verifyToken,
  authorizeRole(["admin"]),
  GuestFeedbackController.restoreFeedback
);

export default router;
