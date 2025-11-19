import { DataTypes } from "sequelize";
import { sequelize } from "../../db/index.js";

const QRCode = sequelize.define("QRCode", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // auto-generate UUID
    primaryKey: true,
    allowNull: false,
  },
  table: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  qrCodeUrl: {
    type: DataTypes.TEXT("long"),   
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
},
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
},
updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
},
deleted_by: {
    type: DataTypes.UUID,
    allowNull: true,
},
}, {
  tableName: "qrcodes",
  timestamps: true,
});

// QRCode.hasMany(Payments, { foreignKey: "qrcodeId" });
export default QRCode;
