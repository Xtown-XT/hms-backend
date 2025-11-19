import NotificationService from "../notification/notification.service.js";  // Ensure correct service import

class NotificationController {
  // Admin only - Create a new notification
  async createNotification(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      const { title, message, recipientType = "all", recipientId } = req.body;

      // Validation for title and message
      if (!title || !message) {
        return res.status(400).json({ success: false, message: "Title and message are required" });
      }

      // Validate recipientType (optional)
      const validRecipientTypes = ["user", "admin", "superadmin", "staff", "all"];
      if (!validRecipientTypes.includes(recipientType)) {
        return res.status(400).json({ success: false, message: "Invalid recipient type" });
      }

      // Create notification
      const notification = await NotificationService.createNotification({
        title,
        message,
        recipientType,
        recipientId,
      });

      return res.status(201).json({ success: true, message: "Notification created successfully", data: notification });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message || "Failed to create notification" });
    }
  }

  // Get all notifications for the user (pagination, filtering, search)
  async getAllNotifications(req, res) {
    try {
      const {
        search = "",
        includeInactive = false,
        page = 1,
        limit = 10,
        orderBy = "createdAt",
        order = "DESC",
      } = req.query;

      const recipientType = req.user.role === "admin" ? "all" : req.user.role;
      const recipientId = req.user.id;

      const result = await NotificationService.getAllNotifications({
        recipientType,
        recipientId,
        search,
        includeInactive: includeInactive === "true",
        page: parseInt(page),
        limit: parseInt(limit),
        orderBy,
        order,
      });

      return res.status(200).json({
        success: true,
        ...result,  // Include pagination and data
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch notifications",
      });
    }
  }

  // Get a notification by ID (access for recipient or admin)
  async getNotificationById(req, res) {
    try {
      const { id } = req.params;
      const notification = await NotificationService.getNotificationById(id);

      // Check for user role or recipient access
      if (req.user.role !== "admin" && notification.recipientId !== req.user.id && notification.recipientType !== "all") {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      return res.status(200).json({ success: true, data: notification });
    } catch (err) {
      return res.status(404).json({ success: false, message: err.message || "Notification not found" });
    }
  }

  // Admin only - Update notification (e.g., mark as read)
  async updateNotification(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      const { id } = req.params;
      const { isRead } = req.body;

      // Ensure isRead is boolean
      if (typeof isRead !== "boolean") {
        return res.status(400).json({ success: false, message: "isRead must be a boolean value" });
      }

      // Call the service method to update the notification
      const updated = await NotificationService.updateNotification(id, { isRead });

      return res.status(200).json({
        success: true,
        message: "Notification updated successfully",
        data: updated,
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message || "Failed to update notification" });
    }
  }

  // Admin only - Delete notification
  async deleteNotification(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      const { id } = req.params;
      await NotificationService.deleteNotification(id);

      return res.status(200).json({ success: true, message: "Notification deleted successfully" });
    } catch (err) {
      return res.status(404).json({ success: false, message: err.message || "Failed to delete notification" });
    }
  }
}

export default new NotificationController();
