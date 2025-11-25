import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";
import Room from "../model/room.model.js";

const Guest = sequelize.define(
  "Guest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    firstname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    lastname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: { len: [8, 15] },
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: { isEmail: true },
    },

    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    id_proof_no: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    id_proof_type: {
      type: DataTypes.ENUM("Aadhar", "Passport", "Driving License", "Voter ID", "PAN"),
      allowNull: false,
    },

    nationality: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: false,
    },

    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    room_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "room",
        key: "room_no",
      }
    },

    room_type: {
      type: DataTypes.ENUM("Single", "Double", "Deluxe", "Suite"),
      allowNull: false,
    },

    no_of_guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },

    stay_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },

    check_in: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    check_out: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    booking_source: {
      type: DataTypes.ENUM("Walk-in", "Online", "Phone", "Agent"),
      allowNull: false,
      defaultValue: "Walk-in",
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
    tableName: "Guests",
    timestamps: true,
    paranoid: true,
  }
);

// ---------- ASSOCIATION ----------
Guest.belongsTo(Room, {
  foreignKey: "room_no",
  targetKey: "room_no",
  as: "roomDetails",
});

export default Guest;
