import { Op } from "sequelize";
import Profile from "../models/profile.models.js";

// Create Profile
export const createProfile = async (data) => {
  return await Profile.create({
    ...data,
    is_active: data.is_active ?? true,
  });
};

// Get Profile by ID
export const getProfileById = async (id) => {
  return await Profile.findByPk(id);
};

// Get all Profiles 
export const getAllProfiles = async ({
  page = 1,
  limit = 10,
  filters = {},
  order = "DESC",
  include = [],
}) => {
  const andConditions = [];

  if (filters.company_name) {
    andConditions.push({
      company_name: { [Op.like]: `%${filters.company_name}%` },
    });
  }
  if (filters.address) {
    andConditions.push({
      address: { [Op.like]: `%${filters.address}%` },
    });
  }
  if (filters.is_active !== undefined) {
    andConditions.push({ is_active: filters.is_active });
  }
  if (filters.gst_number) {
    andConditions.push({
      gst_number: { [Op.like]: `%${filters.gst_number}%` },
    });
  }
  if (filters.phone) {
    andConditions.push({
      phone: { [Op.like]: `%${filters.phone}%` },
    });
  }
  if (filters.email) {
    andConditions.push({
      email: { [Op.like]: `%${filters.email}%` },
    });
  }


  const offset = (page - 1) * limit;

  const orderDirection = (order?.toUpperCase() === "ASC" || order?.toUpperCase() === "DESC")
    ? order.toUpperCase()
    : "DESC";
  const orderBy = [["createdAt", orderDirection]];

  try {
    const result = await Profile.findAndCountAll({
      where: andConditions.length ? { [Op.and]: andConditions } : {},
      order: orderBy,
      limit,
      offset,
      distinct: true,
      include,
      logging: console.log,
    });

    return {
      total: result.count,
      pages: Math.ceil(result.count / limit),
      currentPage: page,
      profiles: result.rows,
    };
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

// Update Profile
export const updateProfile = async (id, data) => {
  const profile = await Profile.findByPk(id);

  if (!profile) return null;

  await profile.update({
    ...data,
    is_active: data.is_active ?? profile.is_active,
  });

  return profile;
};



//  Delete Profile (Soft Delete
export const deleteProfile = async (id, payload = {}) => {
  const profile = await Profile.findByPk(id);
  if (!profile) return null;

  if (payload && Object.keys(payload).length > 0) {
    await profile.update(payload);
  }

  await profile.destroy();
  return profile;
};

//  Restore Profile
export const restoreProfile = async (id) => {
  const profile = await Profile.findOne({ where: { id }, paranoid: false });
  if (!profile) {
    return { success: false, message: "Profile not found" };
  }

  if (profile.deletedAt === null) {
    return { success: false, message: "Profile is already active" };
  }

  await profile.restore();
  return { success: true, message: "Profile restored successfully" };
};