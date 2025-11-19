// src/models/multi_meal_item.model.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

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
  },
  {
    tableName: "multi_meal_items", 
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

export default MultiMealItem;
