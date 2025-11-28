import Tax from "../model/tax.model.js";
import BaseService from "../../services/service.js";
import { createTaxSchema, updateTaxSchema } from "../dto/tax.dto.js";

const taxService = new BaseService(Tax);


export const create = async (req, res) => {
  try {
    const validated = createTaxSchema.parse(req.body);
    const data = { ...validated, created_by: req.user?.id || null };
    const newTax = await taxService.create(data);

    return res.status(201).json({
      success: true,
      message: "Tax created successfully",
      data: newTax,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.errors?.[0]?.message || err.message,
    });
  }
};


export const getAll = async (req, res) => {
  try {
    const {
      includeInactive = false,
      search = "",
      page = 1,
      limit = 10,
      orderBy = "createdAt",
      order = "DESC",
    } = req.query;

    // Call the reusable service with searchFields
    const result = await taxService.getAll({
      includeInactive: includeInactive === "true",
      search,
      page: Number(page),
      limit: Number(limit),
      orderBy,
      order,
      searchFields: ["tax_name", "description", "tax_code", "country", "state"],
    });

    return res.json({
      success: true,
      message: "Taxes fetched successfully",
      ...result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const tax = await taxService.getById(req.params.id);
    return res.json({ success: true, data: tax });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message || "Tax not found",
    });
  }
};


export const update = async (req, res) => {
  try {
    const validated = updateTaxSchema.parse(req.body);
    const updated = await taxService.update(req.params.id, {
      ...validated,
      updated_by: req.user?.id || null,
    });

    return res.json({
      success: true,
      message: "Tax updated successfully",
      data: updated,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.errors?.[0]?.message || err.message,
    });
  }
};

export const softDelete = async (req, res) => {
  try {
    const tax = await taxService.getById(req.params.id);
    await tax.update({
      is_active: false,
      updated_by: req.user?.id || null,
    });

    return res.json({
      success: true,
      message: "Tax deactivated successfully",
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};


export const restore = async (req, res) => {
  try {
    const tax = await taxService.getById(req.params.id);
    await tax.update({
      is_active: true,
      updated_by: req.user?.id || null,
    });

    return res.json({
      success: true,
      message: "Tax restored successfully",
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};