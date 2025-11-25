// src/modules/dining/dining.controller.js
import DiningTable from '../models/dining.models.js';
import BaseService from '../../services/service.js';
import { createDiningTableSchema, updateDiningTableSchema } from '../dto/dining.dto.js';

const DiningTableService = new BaseService(DiningTable);

export const DiningTableController = {
  async create(req, res) {
    try {
      const validated = createDiningTableSchema.parse(req.body);
      validated.created_by = req.user.id; // set creator from token
      const table = await DiningTableService.create(validated);
      res.status(201).json(table);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async findAll(req, res) {
    try {
      const { includeInactive = false, search, page = 1, limit = 10, orderBy = 'createdAt', order = 'ASC' } = req.query;

      const result = await DiningTableService.getAll({
        includeInactive: includeInactive === 'true',
        search,
        page: parseInt(page),
        limit: parseInt(limit),
        orderBy,
        order: order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      });

      res.json({
        total: result.count,
        page: parseInt(page),
        totalPages: Math.ceil(result.count / limit),
        data: result.rows,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params;
      const table = await DiningTableService.getById(id);
      if (!table) return res.status(404).json({ message: 'Not found' });
      res.json(table);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const validated = updateDiningTableSchema.parse(req.body);
      validated.updated_by = req.user.id; // set updater from token
      const table = await DiningTableService.update(id, validated);
      if (!table) return res.status(404).json({ message: 'Not found' });
      res.json(table);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const table = await DiningTableService.delete(id, { deleted_by: req.user.id });
      if (!table) return res.status(404).json({ message: 'Dining table not found' });
      res.json({ message: 'Soft deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async restore(req, res) {
    try {
      const { id } = req.params;
      const table = await DiningTableService.restore(id);
      if (!table) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Restored successfully', data: table });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
