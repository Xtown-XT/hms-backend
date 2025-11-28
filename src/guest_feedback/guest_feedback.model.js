import { sequelize } from "../db/index.js";
import { DataTypes } from "sequelize";
import Guest from "../frontoffice/model/guest.model.js";
import Room from "../frontoffice/model/room.model.js";

const GuestFeedback = sequelize.define(
  "GuestFeedback",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    guest_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "guests",
        key: "id",
      },
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "room",
        key: "id",
      },
    },
    check_in_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    check_out_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    // SERVICE QUALITY (ENUM FIELDS)

    front_desk_assistance: {
      type: DataTypes.ENUM("Excellent", "Good", "Average", "Poor"),
      allowNull: true,
    },
    housekeeping_service: {
      type: DataTypes.ENUM("Excellent", "Good", "Average", "Poor"),
      allowNull: true,
    },
    restaurant_dining_experience: {
      type: DataTypes.ENUM("Excellent", "Good", "Average", "Poor"),
      allowNull: true,
    },

    // ROOM & FACILITIES (ENUM FIELDS)

    cleanliness: {
      type: DataTypes.ENUM("Excellent", "Good", "Average", "Poor"),
      allowNull: true,
    },
    amenities: {
      type: DataTypes.ENUM("Excellent", "Good", "Average", "Poor"),
      allowNull: true,
    },
    pool_fitness_center: {
      type: DataTypes.ENUM("Excellent", "Good", "Average", "Poor"),
      allowNull: true,
    },
    comments: {
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
    tableName: "guest_feedback",
    timestamps: true,
    paranoid: true,

  }
);

GuestFeedback.belongsTo(Guest, { foreignKey: "guest_id", onDelete: "CASCADE" });
GuestFeedback.belongsTo(Room, { foreignKey: "room_id", onDelete: "CASCADE" });

export default GuestFeedback;
