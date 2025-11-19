import { Op } from "sequelize";
import Category from "../model/category.model.js";

//  Create Category
export const createCategory = async (data) => {
  return await Category.create({
    ...data,
    description: data.description || null,
    is_available: data.is_available ?? true,
    is_multi_course: data.is_multi_course ?? false,
  });
};

//  Get Category by ID
export const getCategoryById = async (id) => {
  return await Category.findByPk(id);
};

//  Get All Categories 
export const getAllCategories = async ({
  page = 1,
  limit = 10,
  filters = {},
  order = "DESC",
  include = [],
}) => {
  const andConditions = [];

  if (filters.item_name)
    andConditions.push({ item_name: { [Op.like]: `%${filters.item_name}%` } });

  if (filters.meal_type)
    andConditions.push({ meal_type: filters.meal_type });

  if (filters.is_available !== undefined)
    andConditions.push({ is_available: filters.is_available });

  if (filters.is_multi_course !== undefined)
    andConditions.push({ is_multi_course: filters.is_multi_course });

  const offset = (page - 1) * limit;

  const result = await Category.findAndCountAll({
    where: andConditions.length ? { [Op.and]: andConditions } : {},
    order: [["created_at", order]],
    limit,
    offset,
    distinct: true,
    include,
  });

  return {
    total: result.count,
    pages: Math.ceil(result.count / limit),
    currentPage: page,
    categories: result.rows,
  };
};

// Update Category
export const updateCategory = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) return null;

  await category.update({
    ...data,
    description: data.description ?? category.description,
    is_available: data.is_available ?? category.is_available,
    is_multi_course: data.is_multi_course ?? category.is_multi_course,
  });

  return category;
};

// Soft Delete Category
export const deleteCategory = async (id, payload = {}) => {
  const category = await Category.findByPk(id);
  if (!category) return null;

  await category.update(payload); 
  await category.destroy(); 
  return category;
};

// Restore Category
export const restoreCategory = async (id, updatePayload = {}) => {
  const category = await Category.findOne({ where: { id }, paranoid: false });
  if (!category) return null;

  await category.restore();
  await category.update({
    ...updatePayload,
    updated_at: new Date(),
  });

  return category;
};
