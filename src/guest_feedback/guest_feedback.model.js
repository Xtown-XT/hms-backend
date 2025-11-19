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
        model: Guest,
        key: "id",
      },
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Room,
        key: "id",
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    service_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    cleanliness_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    food_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    feedback_type: {
      type: DataTypes.ENUM("Complaint", "Suggestion", "Compliment", "General"),
      defaultValue: "General",
    },
    status: {
      type: DataTypes.ENUM("Pending", "Reviewed", "Resolved", "Ignored"),
      defaultValue: "Pending",
    },
    category: {
      type: DataTypes.ENUM("service", "food", "room", "general"),
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
