import userService from "../service/user.service.js";
import {
  registerSchema,
  userLoginSchema,
  updateUserSchema,
} from "../dto/user.dto.js";
import exportToPdf from "../../utils/exportPdf.js";

const userController = {
  // Register User
  async createUser(req, res) {
    try {
      const data = registerSchema.body.parse(req.body);
      const user = await userService.createUser(data);
      return res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
      if (err.name === "ZodError") {
        return res.status(400).json({ error: err.errors });
      }
      return res.status(500).json({ error: err.message });
    }
  },

  // Get all users
  async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const orderBy = req.query.orderBy || "desc";
      const exportType = req.query.export;
      const includeInactive = req.query.includeInactive === "true";
      const is_active = req.query.is_active !== undefined
        ? req.query.is_active === "true"
        : undefined;
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;

      const result = await userService.getUsers({
        page, limit, orderBy,
        is_active, includeInactive,
        startDate, endDate
      });

      // Handle PDF export
      if (exportType === "pdf") {
        const templatePath = "user-report.ejs";
        const data = {
          date: new Date().toLocaleDateString(),
          totalCount: result.total,
          users: result.users.map(user => ({
            username: user.username || "N/A",
            email: user.email || "N/A",
            phone: user.phone || "N/A",
            status: user.is_active ? "Active" : "Inactive",
            joined: user.createdAt.toLocaleDateString()
          }))
        };

        const pdfBuffer = await exportToPdf(templatePath, data);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=users-${Date.now()}.pdf`);
        return res.send(pdfBuffer);
      }

      return res.sendSuccess({ data: { ...result } }, "Users retrieved successfully");
    } catch (error) {
      console.error("Error retrieving users:", error);
      return res.sendError("Failed to retrieve users", 500);
    }
  },


  // Get user by ID
  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get currently logged-in user
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const user = await userService.getMe(userId);
      return res.status(200).json({
        message: "Current user retrieved successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error in /me:", error.message);
      return res.status(404).json({ error: error.message });
    }
  },

  // Login user
  async loginUser(req, res) {
    try {
      const data = userLoginSchema.body.parse(req.body);

      if (!data.identifier || !data.password) {
        return res.status(400).json({ error: "Identifier and password are required" });
      }

      const { user, accessToken, refreshToken } = await userService.loginUser(data);

      return res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (err) {
      if (err.message.includes("Invalid email/phone or password")) {
        return res.status(401).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message });
    }
  },

  // Update user
  async updateUserById(req, res) {
    try {
      const data = updateUserSchema.body.parse(req.body);
      const user = await userService.updateUserById(req.params.id, data, req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ message: "User updated successfully", user });
    } catch (err) {
      if (err.name === "ZodError") {
        return res.status(400).json({ error: err.errors });
      }
      return res.status(500).json({ error: err.message });
    }
  },

  // Soft delete user
  async softDeleteUser(req, res) {
    try {
      const result = await userService.softDeleteUser(req.params.id, req.user.id);
      if (!result) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ message: "User soft deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Restore user
  async restoreUser(req, res) {
    try {
      const result = await userService.restoreUser(req.params.id);
      if (!result) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ message: "User restored successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};


export default userController;
