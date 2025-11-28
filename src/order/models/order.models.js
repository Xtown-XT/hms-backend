
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
        model: "guests",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "room",
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
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: "orders",
    timestamps: true,
    paranoid: true, // Enables soft delete

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
