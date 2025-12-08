import { sequelize } from "../db/index.js";
import { DataTypes } from "sequelize";
import Room from "../frontoffice/model/room.model.js";
import Guest from "../frontoffice/model/guest.model.js";
import Order from "../order/models/order.models.js";

const RoomDelivery = sequelize.define(
  "RoomDelivery",
  {
    delivery_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
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
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Room,
        key: "id",
      },
      onDelete: "CASCADE",
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
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "READY",
        "CHECKED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED"
      ),
      defaultValue: "PENDING",
      allowNull: false,
    },
    item_check: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
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
    tableName: "room_delivery",
    timestamps: true,  // Enable timestamps
    paranoid: true,  // Enable soft deletes

  }
);

// Associations
RoomDelivery.belongsTo(Room, { foreignKey: "room_id", onDelete: "CASCADE" });
RoomDelivery.belongsTo(Guest, { foreignKey: "guest_id", onDelete: "CASCADE" });
RoomDelivery.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });

export default RoomDelivery;
