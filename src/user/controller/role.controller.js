// controllers/role.controller.js
import roleService from "../service/role.service.js";
import { createRoleSchema, updateRoleSchema } from "../dto/role.dto.js";

const roleController = {
  // ✅ Create Role
  async create(req, res) {
    try {
      const validatedData = createRoleSchema.parse(req.body);

      const existing = await roleService.findByName(validatedData.role_name);
      if (existing) {
        return res.status(400).json({ error: "Role name already exists" });
      }

      const role = await roleService.createRole(validatedData);
      return res.status(201).json(role);
    } catch (err) {
      return res.status(400).json({
        error: err.errors || err.message,
      });
    }
  },

  // ✅ Get All Roles
  async getAll(req, res) {
    try {
      const roles = await roleService.getAllRoles();
      return res.json(roles);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get Role by ID
  async getById(req, res) {
    try {
      const role = await roleService.getRoleById(req.params.id);
      return res.json(role);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  },

  // ✅ Update Role
  async update(req, res) {
    try {
      const validatedData = updateRoleSchema.parse(req.body);

      if (validatedData.role_name) {
        const existing = await roleService.findByName(validatedData.role_name);
        if (existing && existing.id !== req.params.id) {
          return res.status(400).json({ error: "Role name already exists" });
        }
      }

      const role = await roleService.updateRole(req.params.id, validatedData);
      return res.json(role);
    } catch (err) {
      return res.status(400).json({
        error: err.errors || err.message,
      });
    }
  },

  // ✅ Delete Role
  async delete(req, res) {
    try {
      const result = await roleService.deleteRole(req.params.id);
      return res.json(result);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  },
};

export default roleController;
