import { sequelize } from "../db/index.js";
import { DataTypes } from "sequelize";
import Room from "../frontoffice/model/room.model.js";  
import Guest from "../frontoffice/model/guest.model.js";  

const RoomService = sequelize.define("RoomService", {
  request_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4, 
  },
  room_id: {
    type: DataTypes.UUID, 
    allowNull: false,
    references: {
      model: Room, 
      key: "id",  
    },
    onDelete: "CASCADE", 
  },
  guest_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Guest, 
      key: "id", 
    },
    onDelete: "CASCADE", 
  },
  request_type: {
    type: DataTypes.ENUM('Housekeeping', 'Laundry', 'Towels', 'Maintenance'),
    allowNull: false,
  },
  request_details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending',
    allowNull: false,
  },
  is_active: {                
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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
    onUpdate: DataTypes.NOW,
  },
}, {
  tableName: "roomservice", 
  timestamps: false, 
});

RoomService.belongsTo(Room, { foreignKey: "room_id", onDelete: "CASCADE" });
RoomService.belongsTo(Guest, { foreignKey: "guest_id", onDelete: "CASCADE" });

export default RoomService;
