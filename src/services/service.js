// src/services/service.js
import { Op } from "sequelize";

class BaseService {
  constructor(Model) {
    this.Model = Model;
  }

  // ✅ Create a new record
  async create(data) {
    return await this.Model.create(data);
  }

  // ✅ Get all records with optional search, pagination, and sorting
  async getAll({
    includeInactive = false,
    search = "",
    page = 1,
    limit = 10,
    orderBy = "createdAt",
    order = "ASC",
    searchFields = [], 
  } = {}) {
    const where = {};

    if (!includeInactive) {
      where.is_active = true;
    }

    if (search && searchFields.length > 0) {
      where[Op.or] = searchFields.map((field) => ({
        [field]: { [Op.like]: `%${search}%` },
      }));
    }

    const offset = (page - 1) * limit;

    const rows = await this.Model.findAll({
      where,
      offset,
      limit,
      order: [[orderBy, order.toUpperCase()]],
    });

    const count = await this.Model.count({ where });

    return {
      rows,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  // ✅ Get single record by ID
  async getById(id) {
    const record = await this.Model.findByPk(id);
    if (!record) throw new Error(`${this.Model.name} not found`);
    return record;
  }

  // ✅ Update record by ID
  async update(id, data) {
    const record = await this.Model.findByPk(id);
    if (!record) throw new Error(`${this.Model.name} not found`);
    return await record.update(data);
  }

  // ✅ Soft delete record by ID (paranoid mode)
  async delete(id) {
    const record = await this.Model.findByPk(id);
    if (!record) throw new Error(`${this.Model.name} not found`);
    await record.destroy();
    return { message: `${this.Model.name} deleted successfully` };
  }

  // ✅ Restore a soft-deleted record by ID (paranoid mode)
  async restore(id) {
    try {
      // Find the record including soft-deleted ones (paranoid: false)
      const record = await this.Model.findByPk(id, { paranoid: false });

      // If the record doesn't exist, throw an error
      if (!record) throw new Error(`${this.Model.name} not found`);

      // If the record is already restored (i.e., `deletedAt` is null), skip restoration
      if (!record.deletedAt) {
        throw new Error(`${this.Model.name} is restored`);
      }

      // Restore the record
      await record.restore();
      return { message: `${this.Model.name} restored successfully` };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default BaseService;
