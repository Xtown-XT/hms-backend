// import { sequelize } from '../../db/index.js';
// import { DataTypes } from 'sequelize';

// const Orders = sequelize.define(
//   'orders',
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//       allowNull: false,
//     },
//     order_code: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       unique: true,
//     },
//     order_type: {
//       type: DataTypes.ENUM('dine-in', 'takeaway'),
//       allowNull: false,
//     },
//     table_no: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM('pending', 'ready', 'served', 'completed'),
//       defaultValue: 'pending',
//       allowNull: false,
//     },
//     view: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//     },
//     view_time: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//     is_active: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: true,
//     },
//     createdBy: {
//       type: DataTypes.UUID,
//       allowNull: true,
//       defaultValue: null,
//     },
//     updatedBy: {
//       type: DataTypes.UUID,
//       allowNull: true,
//       defaultValue: null,
//     },
//   },
//   {
//     tableName: 'orders',
//     timestamps: true,
//     indexes: [
//       {
//         unique: true,
//         fields: ['order_code'],
//       },
//     ],
//   }
// );

// export default Orders;


import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";
import Guest from "../../frontoffice/model/guest.model.js";
import Room from "../../frontoffice/model/room.model.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    guest_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Guest,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Room,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Confirmed",
        "Preparing",
        "Ready",
        "Delivered",
        "Cancelled"
      ),
      defaultValue: "Pending",
    },
    payment_status: {
      type: DataTypes.ENUM("Unpaid", "Paid", "Failed"),
      defaultValue: "Unpaid",
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    deleted_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    paranoid: true, // Enables soft delete
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

// ✅ Define associations
Order.belongsTo(Guest, {
  foreignKey: "guest_id",
  as: "guest",
});

Order.belongsTo(Room, {
  foreignKey: "room_id",
  as: "room",
});

export default Order;
