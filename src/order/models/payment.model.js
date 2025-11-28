import { DataTypes } from "sequelize";
import { sequelize } from "../../db/index.js";
import Order from "../models/order.models.js"

const Payments = sequelize.define("Payment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Order,
      key: "id"
    }
  },
  bill_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  bill_amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  method: {
    type: DataTypes.ENUM("CASH", "CARD", "UPI"),
    allowNull: false,
    defaultValue: "CASH"
  },
  status: {
    type: DataTypes.ENUM("SUCCESS", "FAILED"),
    allowNull: false,
    defaultValue: "SUCCESS"

  },
  amount_received: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  balance: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
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
  tableName: "payments",
  timestamps: true,
  paranoid: true,
});

Payments.belongsTo(Order, { foreignKey: "id" });


export default Payments;
