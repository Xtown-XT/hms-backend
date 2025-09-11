// services/role.service.js
import Role from "../models/role.model.js";

const roleService = {
  async createRole(data) {
    return await Role.create(data);
  },

  async getAllRoles() {
    return await Role.findAll();
  },

  async getRoleById(id) {
    const role = await Role.findByPk(id);
    if (!role) throw new Error("Role not found");
    return role;
  },

  async updateRole(id, data) {
    const role = await Role.findByPk(id);
    if (!role) throw new Error("Role not found");
    await role.update(data);
    return role;
  },

  async deleteRole(id) {
    const role = await Role.findByPk(id);
    if (!role) throw new Error("Role not found");
    await role.destroy();
    return { message: "Role deleted successfully" };
  },

  async findByName(role_name) {
    return await Role.findOne({ where: { role_name } });
  },
};

export default roleService;
