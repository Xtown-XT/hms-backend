// import { sequelize } from '../../db/index.js';
// import { DataTypes } from 'sequelize';
// import Orders from './order.models.js';

// const OrderItems = sequelize.define(
//   'order_items',
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//       allowNull: false,
//     },
//     order_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: Orders,
//         key: 'id',
//       },
//     },
//     item_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     quantity: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       // defaultValue: 1,
//     },
//     price: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//     },
//     is_active: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: true,
//     },
//   },
//   {
//     tableName: 'order_items',
//     timestamps: true,
//   }
// );

// export default OrderItems;


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
        model: Order,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    meal_item_id: { 
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: MealItem, 
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
  },
  {
    tableName: "order_items",
    timestamps: true,
    paranoid: true, 
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

// ✅ Define associations
OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
  as: "order",
});

OrderItem.belongsTo(MealItem, { 
  foreignKey: "meal_item_id", 
  as: "meal_item",
});

Order.hasMany(OrderItem, {
  foreignKey: "order_id",
  as: "items",
});

MealItem.hasMany(OrderItem, { 
  foreignKey: "meal_item_id", 
  as: "order_items",
});

export default OrderItem;
