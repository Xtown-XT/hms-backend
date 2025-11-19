import { DataTypes } from "sequelize";
import { sequelize } from "../../db/index.js";
import InventoryItem from "./inventory_item.model.js";

const StockLog = sequelize.define(
  "StockLog",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "inventory_items",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    transaction_type: {
      type: DataTypes.ENUM("IN", "OUT"),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    issued_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    transaction_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: "stock_logs",
    timestamps: true,
  }
);

// Associations
InventoryItem.hasMany(StockLog, {
  foreignKey: "item_id",
  as: "stock_logs",
  onDelete: "CASCADE",
});

StockLog.belongsTo(InventoryItem, {
  foreignKey: "item_id",
  as: "item",
});

export default StockLog;
