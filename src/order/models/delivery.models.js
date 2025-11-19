// import { sequelize } from '../../db/index.js';
// import { DataTypes } from 'sequelize';
// import Orders from './order.models.js';


// const Deliveries = sequelize.define(
//   'deliveries',
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//       allowNull: false,
//     },
//     order_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: Orders,
//         key: 'id',
//       },
//       onDelete: 'CASCADE',
//     },
//     served_by: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },
//     served_at: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW
//     },
//   },
//   {
//     tableName: 'deliveries',
//     timestamps: false,
//   }
// );

// // Associations
// Orders.hasOne(Deliveries, { foreignKey: 'order_id', as: 'delivery' });
// Deliveries.belongsTo(Orders, { foreignKey: 'order_id' });

// export default Deliveries;
