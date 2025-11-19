import { sequelize } from "../db/index.js";
import { DataTypes } from "sequelize";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recipientType: {
      type: DataTypes.ENUM("user", "admin", "superadmin", "staff", "all"),
      defaultValue: "all",
    },
    recipientId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;
