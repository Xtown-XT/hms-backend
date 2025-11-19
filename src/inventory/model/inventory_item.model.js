import { DataTypes } from "sequelize";
import { sequelize } from "../../db/index.js";

const InventoryItem = sequelize.define(
  "InventoryItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    item_name: {
      type: DataTypes.ENUM(
        "Bath Towel",
        "Shampoo Bottle",
        "Pillow Cover",
        "Detergent",
        "Soap",
        "Air Freshener",
        "Cleaning Cloth",
        "Toilet Paper"
      ),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("Linen", "Toiletries", "Cleaning Supplies"),
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pcs",
    },
    quantity_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    reorder_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    purchase_price: {
      type: DataTypes.FLOAT,
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
    tableName: "inventory_items",
    timestamps: true,
  }
);

export default InventoryItem;
