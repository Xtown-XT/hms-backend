
import Orders from './order.models.js';
import OrderItems from './order_items.models.js';


Orders.hasMany(OrderItems, { as: 'items', foreignKey: 'order_id' });
OrderItems.belongsTo(Orders, { as: 'order', foreignKey: 'order_id' });

export { Orders, OrderItems };

