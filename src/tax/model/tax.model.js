import { DataTypes } from "sequelize";
import { sequelize } from "../../db/index.js";

const Tax = sequelize.define(
  "Tax",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    tax_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Name of the tax (e.g., GST, VAT, Service Tax)",
    },

    tax_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: "Tax rate percentage (e.g., 18.00 for 18%)",
    },

    tax_type: {
      type: DataTypes.ENUM("inclusive", "exclusive"),
      defaultValue: "exclusive",
      comment: "Whether the tax is included in price or added separately",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Optional description or notes about the tax",
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
    tableName: "taxes",
    timestamps: true,
    paranoid:true,
  }
);

export default Tax;