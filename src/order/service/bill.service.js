// import Bills from '../models/bills.models.js';
// import Orders from '../models/order.models.js';
// import OrderItems from '../models/order_items.models.js';


// class BillService {
//   async generateBill(order_id) {
//     const order = await Orders.findByPk(order_id, {
//       include: [{ model: OrderItems, as: 'items' }],
//     });
//     if (!order) throw new Error('Order not found');

//     const totalAmount = order.items.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );

//     const bill = await Bills.create({
//       order_id,
//       total_amount: totalAmount,
//       payment_status: 'unpaid',
//     });
//     return bill;
//   }

//   async getBillById(id) {
//     const bill = await Bills.findByPk(id, {
//       include: [{ model: Orders, as: 'order' }],
//     });
//     if (!bill) throw new Error('Bill not found');
//     return bill;
//   }

// async getAllBills({ includeInactive, search, page, limit, orderBy, order }) {
//     const where = {};

//     // Exclude inactive bills unless includeInactive = true
//     if (!includeInactive) {
//       where.is_active = true;
//     }

//     // Search filter (example: bill_number OR order.name)
//     if (search) {
//       where[Op.or] = [
//         { bill_number: { [Op.like]: `%${search}%` } },
//         { '$order.order_name$': { [Op.like]: `%${search}%` } }, // nested search inside order
//       ];
//     }

//     // Pagination
//     const offset = page && limit ? (page - 1) * limit : undefined;

//     const bills = await Bills.findAndCountAll({
//       where,
//       include: [{ model: Orders, as: "order" }],
//       order: [[orderBy || "createdAt", order?.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
//       offset,
//       limit: limit ? parseInt(limit) : undefined,
//     });

//     return {
//       total: bills.count,
//       page: page ? parseInt(page) : 1,
//       limit: limit ? parseInt(limit) : bills.count,
//       data: bills.rows,
//     };
//   }

//   async deleteBill(id) {
//     const bill = await Bills.findByPk(id);
//     if (!bill) throw new Error('Bill not found');
//     await bill.destroy();
//     return { message: 'Bill deleted successfully' };
//   }
// }

// export default new BillService();





import { Op } from "sequelize";
import Bills from "../models/bills.models.js";
import Orders from "../models/order.models.js";
import OrderItems from "../models/order_items.models.js";
import Room from "../../frontoffice/model/room.model.js";

class BillService {
  /**
   * ✅ Generate a bill for a given order and room
   */
  async generateBill(order_id, room_id, createdBy = null) {
    // Fetch the order with its order items
    const order = await Orders.findByPk(order_id, {
      include: [{ model: OrderItems, as: "items" }],
    });

    if (!order) throw new Error("Order not found");

    // Calculate total amount
    const totalAmount = order.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Create new bill record
    const bill = await Bills.create({
      order_id,
      room_id,
      total_amount: totalAmount,
      payment_status: "unpaid",
      createdBy,
    });

    return bill;
  }

  /**
   * ✅ Get a bill by its ID (includes order & room)
   */
  async getBillById(id) {
    const bill = await Bills.findByPk(id, {
      include: [
        { model: Orders, as: "order" },
        { model: Room, as: "room" },
      ],
    });

    if (!bill) throw new Error("Bill not found");
    return bill;
  }

  /**
   * ✅ Get all bills (with filters, pagination, and sorting)
   */
  async getAllBills({
    includeInactive = false,
    search = "",
    page = 1,
    limit = 10,
    orderBy = "createdAt",
    order = "DESC",
  }) {
    const where = {};

    // Only active bills by default
    if (!includeInactive) {
      where.is_active = true;
    }

    // Search filter (by payment status, order id, or room number)
    if (search) {
      where[Op.or] = [
        { payment_status: { [Op.like]: `%${search}%` } },
        { "$order.id$": { [Op.like]: `%${search}%` } },
        { "$room.room_number$": { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const bills = await Bills.findAndCountAll({
      where,
      include: [
        { model: Orders, as: "order" },
        { model: Room, as: "room" },
      ],
      order: [[orderBy, order.toUpperCase() === "ASC" ? "ASC" : "DESC"]],
      offset,
      limit: parseInt(limit),
    });

    return {
      total: bills.count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: bills.rows,
    };
  }

  /**
   * ✅ Update a bill (e.g., mark as paid)
   */
  async updateBill(id, updates) {
    const bill = await Bills.findByPk(id);
    if (!bill) throw new Error("Bill not found");

    await bill.update(updates);
    return bill;
  }

  /**
   * ✅ Delete a bill (soft delete or hard delete)
   */
  async deleteBill(id, { softDelete = true } = {}) {
    const bill = await Bills.findByPk(id);
    if (!bill) throw new Error("Bill not found");

    if (softDelete) {
      await bill.update({ is_active: false });
      return { message: "Bill deactivated successfully" };
    } else {
      await bill.destroy();
      return { message: "Bill deleted permanently" };
    }
  }
}

export default new BillService();
