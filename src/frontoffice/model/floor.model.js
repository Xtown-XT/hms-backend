import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Floor = sequelize.define(
  "Floor",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    floor_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "floor",
    timestamps: true,
    paranoid: true,

  }
);

export default Floor;
