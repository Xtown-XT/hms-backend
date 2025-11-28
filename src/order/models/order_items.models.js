import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";
import Order from "../models/order.models.js";
import MealItem from "../../digital_menu/model/meal_item.model.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "orders",
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    special_request: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    }
  },
  {
    tableName: "order_items",
    timestamps: true,
    paranoid: true,

  }
);

// OrderItem.belongsTo(Order, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
  as: "order",
});
// OrderItem.belongsTo(MealItem, { foreignKey: "meal_item_id" });
MealItem.hasMany(OrderItem, {
  foreignKey: "meal_item_id",
  as: "orderItems"
});

export default OrderItem;
