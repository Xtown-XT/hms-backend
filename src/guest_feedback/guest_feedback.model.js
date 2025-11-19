import { sequelize } from "../db/index.js";
import { DataTypes } from "sequelize";
import Guest from "../frontoffice/model/guest.model.js";
import Room from "../frontoffice/model/room.model.js";

const GuestFeedback = sequelize.define(
  "GuestFeedback",
  {
    feedback_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    waiter_rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    housekeeping_rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    chef_rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    hotel_rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    feedback: {
      type: DataTypes.STRING(255),
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
    guest_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stay_duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    resolved_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "guest_feedback",
    timestamps: true,
    paranoid: true,  
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

GuestFeedback.belongsTo(Guest, { foreignKey: "guest_id", onDelete: "CASCADE" });
GuestFeedback.belongsTo(Room, { foreignKey: "room_id", onDelete: "CASCADE" });

export default GuestFeedback;
