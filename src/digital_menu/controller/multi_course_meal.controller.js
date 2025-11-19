// src/modules/multiCourseMeal/controller/multi_course_meal.controller.js
import MultiCourseMeal from "../model/multi_course_meal.model.js";  


const isAdmin = (req) => req.user && req.user.role === "admin";

const createMultiCourseMeal = async (req, res) => {
  try {
    const { meal_name, description, price, menu_item_id, duration, image } = req.body;

    const newMeal = await MultiCourseMeal.create({
      meal_name,
      description,
      price,
      menu_item_id, 
      duration,
      image,
    });

    return res.status(201).json({
      message: "MultiCourseMeal created successfully",
      data: newMeal,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllMultiCourseMeals = async (req, res) => {
  try {
    const multiCourseMeals = await MultiCourseMeal.findAll({
      paranoid: false, // Include soft-deleted records
    });
    return res.status(200).json({
      message: "MultiCourseMeals fetched successfully",
      data: multiCourseMeals,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getMultiCourseMealById = async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await MultiCourseMeal.findByPk(id, { paranoid: false }); // Include soft-deleted records

    if (!meal) {
      return res.status(404).json({ message: "MultiCourseMeal not found" });
    }

    return res.status(200).json({
      message: "MultiCourseMeal fetched successfully",
      data: meal,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updateMultiCourseMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { meal_name, description, price, menu_item_id, duration, image } = req.body;

    // Ensure the meal exists
    const meal = await MultiCourseMeal.findByPk(id, { paranoid: false });
    if (!meal) {
      return res.status(404).json({ message: "MultiCourseMeal not found" });
    }

    const updatedMeal = await MultiCourseMeal.update(
      { meal_name, description, price, menu_item_id, duration, image },
      { where: { id }, returning: true }
    );

    return res.status(200).json({
      message: "MultiCourseMeal updated successfully",
      data: updatedMeal[1][0],
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteMultiCourseMeal = async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await MultiCourseMeal.findByPk(id, { paranoid: false });
    if (!meal) {
      return res.status(404).json({ message: "MultiCourseMeal not found" });
    }

    await meal.destroy();
    return res.status(200).json({
      message: "MultiCourseMeal deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const restoreMultiCourseMeal = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim(); // remove hidden spaces/newlines

    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch the meal, including soft-deleted records
    const meal = await MultiCourseMeal.findByPk(id, { paranoid: false });
    if (!meal) return res.status(404).json({ message: "MultiCourseMeal not found" });

    // Restore if soft-deleted
    if (meal.deleted_at !== null) {
      await meal.restore();
    }

    // Apply optional updates from request body
    const updates = req.body || {};
    if (Object.keys(updates).length > 0) {
      await meal.update(updates);
    }

    return res.status(200).json({
      message: "MultiCourseMeal restored successfully",
      data: meal, // return the latest restored/updated object
    });
  } catch (error) {
    console.error("Restore MultiCourseMeal Error:", error);
    return res.status(500).json({ error: error.message });
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
