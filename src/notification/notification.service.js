import { Op } from "sequelize";
import Notification from "../notification/notification.model.js";

class NotificationService {
  // ---------------- CREATE ----------------
  async createNotification({ title, message, recipientType = "all", recipientId = null }) {
    try {
      const notification = await Notification.create({
        title,
        message,
        recipientType,
        recipientId,
        isRead: false,
        isActive: true,
      });
      return notification;
    } catch (error) {
      throw new Error("Error creating notification: " + error.message);
    }
  }

  // ---------------- GET BY ID ----------------
  async getNotificationById(id) {
    try {
      const notification = await Notification.findByPk(id);
      if (!notification) throw new Error("Notification not found");
      return notification;
    } catch (error) {
      throw new Error("Error fetching notification: " + error.message);
    }
  }

  // ---------------- GET ALL (With Pagination, Search, Filtering) ----------------
  async getAllNotifications({
    recipientType,
    recipientId,
    search = "",
    includeInactive = false,
    page = 1,
    limit = 10,
    orderBy = "createdAt",
    order = "DESC",
  }) {
    try {
      const where = {
        [Op.and]: [],
      };

      // Filter: Only active notifications unless includeInactive=true
      if (!includeInactive) {
        where[Op.and].push({ isActive: true });
      }

      // Recipient filtering
      if (recipientType === "all") {
        // Admins can see everything
      } else {
        // Normal users: see their own + global notifications
        where[Op.and].push({
          [Op.or]: [
            { recipientType: recipientType },
            { recipientType: "all" },
            { recipientId: recipientId },
          ],
        });
      }

      // Search by title or message
      if (search) {
        where[Op.and].push({
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { message: { [Op.like]: `%${search}%` } },
          ],
        });
      }

      const offset = (page - 1) * limit;

      // Fetch paginated results
      const { count, rows } = await Notification.findAndCountAll({
        where,
        order: [[orderBy, order.toUpperCase() === "ASC" ? "ASC" : "DESC"]],
        offset,
        limit: parseInt(limit),
      });

      const totalPages = Math.ceil(count / limit) || 1;

      return {
        success: true,
        page: parseInt(page),
        totalPages,
        totalItems: count,
        data: rows,
      };
    } catch (error) {
      throw new Error("Error fetching notifications: " + error.message);
    }
  }

  // ---------------- UPDATE ----------------
  async updateNotification(id, updates) {
    try {
      const notification = await Notification.findByPk(id);
      if (!notification) throw new Error("Notification not found");

      await notification.update(updates);
      return notification;
    } catch (error) {
      throw new Error("Error updating notification: " + error.message);
    }
  }

  // ---------------- DELETE (Soft Delete) ----------------
  async deleteNotification(id) {
    try {
      const notification = await Notification.findByPk(id);
      if (!notification) throw new Error("Notification not found");

      // Soft delete (set isActive = false)
      await notification.update({ isActive: false });
      return { message: "Notification deleted successfully" };
    } catch (error) {
      throw new Error("Error deleting notification: " + error.message);
    }
  }
}

export default new NotificationService();
