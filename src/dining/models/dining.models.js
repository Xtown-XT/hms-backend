import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';


const DiningTable = sequelize.define('DiningTable', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  table_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
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
}, {
  tableName: 'dining_tables',
  timestamps: true,
  paranoid: true
});


export default DiningTable;