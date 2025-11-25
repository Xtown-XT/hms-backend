// src/models/multi_meal_item.model.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

// Import related models
import MultiCourseMeal from "./multi_course_meal.model.js";
import MealItem from "./meal_item.model.js";

const MultiMealItem = sequelize.define(
  "MultiMealItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    multi_meal_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "multi_course_meals",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    meal_item_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "meal_items",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    course_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },

    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "multi_meal_items",
    timestamps: true,
    paranoid: true,
  }
);


MultiCourseMeal.belongsToMany(MealItem, {
  through: MultiMealItem,
  foreignKey: "multi_meal_id",
  otherKey: "meal_item_id",
  as: "meal_items",
});

MealItem.belongsToMany(MultiCourseMeal, {
  through: MultiMealItem,
  foreignKey: "meal_item_id",
  otherKey: "multi_meal_id",
  as: "multi_course_meals",
});

export default MultiMealItem;
