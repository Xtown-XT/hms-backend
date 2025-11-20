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

    floor_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Floor,
        key: "floor_no",  // FK → Floor.floor_no
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
      allowNull: true,
    },

    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "room",
    timestamps: true,
    paranoid: true,
  }
);

// Associations
Room.belongsTo(Floor, { foreignKey: "floor_no", targetKey: "floor_no" });
Floor.hasMany(Room, { foreignKey: "floor_no", sourceKey: "floor_no" });

export default Room;
