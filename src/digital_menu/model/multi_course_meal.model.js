// src/models/MultiCourseMeal.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";
import MealItem from "./meal_item.model.js";       
import MultiMealItem from "./multi_meal_item.model.js"; 

const MultiCourseMeal = sequelize.define(
  "MultiCourseMeal",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    meal_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "multi_course_meals",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

// ✅ Associations
MultiCourseMeal.belongsToMany(MealItem, {
  through: MultiMealItem,       
  foreignKey: "multi_meal_id",  
  otherKey: "meal_item_id",     
  as: "meal_items",            
});

// ✅ Optional reverse association
MealItem.belongsToMany(MultiCourseMeal, {
  through: MultiMealItem,
  foreignKey: "meal_item_id",
  otherKey: "multi_meal_id",
  as: "multi_course_meals",
});

export default MultiCourseMeal;
