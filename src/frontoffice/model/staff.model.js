// src/modules/staff/model/staff.model.js

import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Staff = sequelize.define(
  "Staff",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    role: {
      type: DataTypes.ENUM("admin", "staff", "manager"),
      allowNull: false,
      defaultValue: "staff",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
  },
  {
    tableName: "staff",
    timestamps: true,
    paranoid: true, // soft delete support
  }
);

export default Staff;
