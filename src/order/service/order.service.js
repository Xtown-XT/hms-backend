
// import { Orders, OrderItems } from '../models/index.js';
// import { Op, fn, col, literal } from 'sequelize';

// class OrderService {
//   // Create a new order with items
//   async createOrder(orderData) {
//     const { items, ...orderFields } = orderData;

//     const order = await Orders.create(
//       {
//         ...orderFields,
//         items: items || [],
//       },
//       {
//         include: [{ model: OrderItems, as: 'items' }],
//       }
//     );

//     return order;
//   }

//   // Get all orders with optional status filter
// async getAllOrders({
//     status = null,
//     includeInactive = false,
//     search = null,
//     page = 1,
//     limit = 10,
//     orderBy = "createdAt",
//     order = "asc",
//   }) {
//     const whereClause = {};

//     // Status filter
//     if (status) {
//       whereClause.status = status;
//     }

//     // Active filter
//     if (!includeInactive) {
//       whereClause.is_active = true; // assumes you have `is_active` column
//     }

//     // Search filter (example: order_number or customer_name)
//     if (search) {
//       whereClause[Op.or] = [
//         { order_number: { [Op.like]: `%${search}%` } },
//         { customer_name: { [Op.like]: `%${search}%` } },
//       ];
//     }

//     // Pagination
//     const offset = (page - 1) * limit;

//     const orders = await Orders.findAndCountAll({
//       where: whereClause,
//       include: [{ model: OrderItems, as: "items" }],
//       order: [[orderBy, order.toUpperCase()]], // ASC / DESC
//       limit: parseInt(limit),
//       offset,
//     });

//     return {
//       data: orders.rows,
//       total: orders.count,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       totalPages: Math.ceil(orders.count / limit),
//     };
//   }

//   // Get daily item summary 
//   async getDailyItemSummary() {
//     return await OrderItems.findAll({
//       attributes: [
//         'item_name',
//         [fn('SUM', col('quantity')), 'total_quantity'],
//         [fn('SUM', literal('quantity * price')), 'total_amount'],
//         // [fn('SUM', col('payment.amount_received')), 'amount_received'],
//         [fn('MAX', fn('DATE', col('order.createdAt'))), 'order_day'],
//       ],
//       include: [
//         {
//           model: Orders,
//           as: 'order',
//           attributes: [],
//         },
//       ],
//       group: ['item_name'],
//       order: [[fn('MAX', fn('DATE', col('order.createdAt'))), 'DESC']],
//       raw: true,
//     });
//   }

//   // Get order by ID
//   async getOrderById(orderId) {
//     const order = await Orders.findOne({
//       where: { id: orderId },
//       include: [{ model: OrderItems, as: 'items' }],
//     });
//     if (!order) throw new Error('Order not found');
//     return order;
//   }

//   // Update order status
//   async updateOrderStatus(orderId, status) {
//     const order = await Orders.findByPk(orderId);
//     if (!order) throw new Error('Order not found');
//     order.status = status;
//     await order.save();
//     return order;
//   }

//   // Soft delete order
//   async deleteOrder(orderId) {
//     const order = await Orders.findByPk(orderId);
//     if (!order) throw new Error('Order not found');
//     await order.destroy(); // if paranoid: true, this will soft delete
//     return { message: 'Order deleted successfully' };
//   }

//   // Add item to existing order
//   async addItemToOrder(orderId, itemData) {
//     const order = await Orders.findByPk(orderId);
//     if (!order) throw new Error('Order not found');

//     const item = await OrderItems.create({
//       ...itemData,
//       order_id: orderId,
//     });
//     return item;
//   }
// }

// export default new OrderService();
