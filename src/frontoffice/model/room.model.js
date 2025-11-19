import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";
import Floor from "../model/floor.model.js";

const Room = sequelize.define(
  "Room",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    room_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    floor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "floor",
        key: "id",
      },
      onDelete: "CASCADE",
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
    tableName: "room",
    timestamps: true,
    paranoid: true,

  }
);

Room.belongsTo(Floor, { foreignKey: "floor_id" });

export default Room;
