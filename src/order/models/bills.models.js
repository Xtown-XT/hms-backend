import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";
import Orders from "./order.models.js";
import Room from "../../frontoffice/model/room.model.js"; 

const Bills = sequelize.define(
  "bills",
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
        model: Orders,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Room,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("unpaid", "paid"),
      allowNull: false,
      defaultValue: "unpaid",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "bills",
    timestamps: true,
  }
);

Orders.hasOne(Bills, { foreignKey: "order_id", as: "bill" });
Bills.belongsTo(Orders, { foreignKey: "order_id", as: "order" });

Room.hasMany(Bills, { foreignKey: "room_id", as: "bills" });
Bills.belongsTo(Room, { foreignKey: "room_id", as: "room" });

export default Bills;
