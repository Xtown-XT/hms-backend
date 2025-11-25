// src/modules/multiCourseMeal/controller/multi_course_meal.controller.js
import MultiCourseMeal from "../model/multi_course_meal.model.js";

// Check if user is admin
const isAdmin = (req) => req.user && req.user.role === "admin";

// Generate full image URL
const formatImageUrl = (req, filename, folder = "multi_course_meals") => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${folder}/${filename}`;
};

// ------------------ CREATE ------------------
export const createMultiCourseMeal = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: "Admins only." });

  try {
    const { meal_name, description, price, menu_item_id, duration } = req.body;
    const image = req.file ? req.file.filename : null;

    const newMeal = await MultiCourseMeal.create({
      meal_name,
      description,
      price,
      menu_item_id,
      duration,
      image,
      created_by: req.user.id,
    });

    const data = newMeal.toJSON();
    if (data.image) data.image = formatImageUrl(req, data.image);

    return res.status(201).json({
      success: true,
      message: "MultiCourseMeal created successfully",
      data,
    });
  } catch (error) {
    console.error("Create MultiCourseMeal Error:", error);
    return res.status(500).json({ success: false, message: "Failed to create meal", error: error.message });
  }
};

// ------------------ GET ALL ------------------
export const getAllMultiCourseMeals = async (req, res) => {
  try {
    const meals = await MultiCourseMeal.findAll({ paranoid: false });

    const formatted = meals.map((meal) => {
      const m = meal.toJSON();
      if (m.image) m.image = formatImageUrl(req, m.image);
      return m;
    });

    return res.status(200).json({
      success: true,
      message: "MultiCourseMeals fetched successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("Get MultiCourseMeals Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch meals", error: error.message });
  }
};

// ------------------ GET BY ID ------------------
export const getMultiCourseMealById = async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await MultiCourseMeal.findByPk(id, { paranoid: false });

    if (!meal) return res.status(404).json({ success: false, message: "MultiCourseMeal not found" });

    const data = meal.toJSON();
    if (data.image) data.image = formatImageUrl(req, data.image);

    return res.status(200).json({
      success: true,
      message: "MultiCourseMeal fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get MultiCourseMeal Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch meal", error: error.message });
  }
};

// ------------------ UPDATE ------------------
export const updateMultiCourseMeal = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: "Admins only." });

  try {
    const { id } = req.params;
    const { meal_name, description, price, menu_item_id, duration } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const meal = await MultiCourseMeal.findByPk(id, { paranoid: false });
    if (!meal) return res.status(404).json({ success: false, message: "MultiCourseMeal not found" });

    const updatedMeal = await meal.update({
      ...(meal_name && { meal_name }),
      ...(description && { description }),
      ...(price && { price }),
      ...(menu_item_id && { menu_item_id }),
      ...(duration && { duration }),
      ...(image && { image }),
      updated_by: req.user.id,
    });

    const data = updatedMeal.toJSON();
    if (data.image) data.image = formatImageUrl(req, data.image);

    return res.status(200).json({
      success: true,
      message: "MultiCourseMeal updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update MultiCourseMeal Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update meal", error: error.message });
  }
};

// ------------------ DELETE (SOFT) ------------------
export const deleteMultiCourseMeal = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: "Admins only." });

  try {
    const { id } = req.params;
    const meal = await MultiCourseMeal.findByPk(id, { paranoid: false });
    if (!meal) return res.status(404).json({ success: false, message: "MultiCourseMeal not found" });

    await meal.destroy();
    return res.status(200).json({ success: true, message: "MultiCourseMeal soft-deleted successfully" });
  } catch (error) {
    console.error("Delete MultiCourseMeal Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete meal", error: error.message });
  }
};

// ------------------ RESTORE ------------------
export const restoreMultiCourseMeal = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: "Admins only." });

  try {
    const { id } = req.params;
    const meal = await MultiCourseMeal.findByPk(id, { paranoid: false });
    if (!meal) return res.status(404).json({ success: false, message: "MultiCourseMeal not found" });

    if (meal.deletedAt) await meal.restore();

    // Optional updates
    const { meal_name, description, price, menu_item_id, duration } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const updatedMeal = await meal.update({
      ...(meal_name && { meal_name }),
      ...(description && { description }),
      ...(price && { price }),
      ...(menu_item_id && { menu_item_id }),
      ...(duration && { duration }),
      ...(image && { image }),
      updated_by: req.user.id,
    });

    const data = updatedMeal.toJSON();
    if (data.image) data.image = formatImageUrl(req, data.image);

    return res.status(200).json({
      success: true,
      message: "MultiCourseMeal restored successfully",
      data,
    });
  } catch (error) {
    console.error("Restore MultiCourseMeal Error:", error);
    return res.status(500).json({ success: false, message: "Failed to restore meal", error: error.message });
  }
};

export default {
  createMultiCourseMeal,
  getAllMultiCourseMeals,
  getMultiCourseMealById,
  updateMultiCourseMeal,
  deleteMultiCourseMeal,
  restoreMultiCourseMeal,
};
