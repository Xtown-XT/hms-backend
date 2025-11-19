// import OrderItems from "../models/order_items.models.js";
// import Category from "../../category/model/category.model.js"; 

// // Create order items (bulk)
// export async function createOrderItemsBulkService(data) {
//   const { order_id, items } = data;

//   const payload = items.map(item => ({
//     order_id,
//     menu_item_id: item.menu_item_id,
//     quantity: item.quantity || 1,
//     status: item.status || "pending",
//   }));

//   const createdItems = await OrderItems.bulkCreate(payload);
//   return createdItems;
// }

// // Get all order items (with menu item details)
// export async function getAllOrderItemsService(filter = {}) {
//   return await OrderItems.findAll({
//     where: filter,
//     include: [
//       {
//         model: Category,
//         as: "menu_item",
//         attributes: ["id", "item_name", "price", "meal_type"],
//       },
//     ],
//   });
// }

// // Get order item by ID
// export async function getOrderItemByIdService(itemId) {
//   return await OrderItems.findOne({
//     where: { id: itemId },
//     include: [
//       {
//         model: Category,
//         as: "menu_item",
//         attributes: ["id", "item_name", "price", "meal_type"],
//       },
//     ],
//   });
// }

// // Update order item by ID
// export async function updateOrderItemService(itemId, data) {
//   const item = await OrderItems.findOne({ where: { id: itemId } });
//   if (!item) throw new Error("Order item not found");

//   await item.update(data);
//   return item;
// }

// // Delete order item by ID
// export async function deleteOrderItemService(itemId) {
//   const item = await OrderItems.findOne({ where: { id: itemId } });
//   if (!item) throw new Error("Order item not found");

//   await item.destroy();
//   return { message: "Order item deleted successfully" };
// }
