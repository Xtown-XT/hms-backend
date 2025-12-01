// import billService from '../service/bill.service.js';

// class BillController {
//   async generateBill(req, res) {
//     try {
//       const { order_id } = req.body;
//       const bill = await billService.generateBill(order_id);
//       return res.status(201).json({
//         success: true,
//         message: 'Bill generated successfully',
//         data: bill,
//       });
//     } catch (err) {
//       return res.status(400).json({ success: false, message: err.message });
//     }
//   }

//   async getBillById(req, res) {
//     try {
//       const { id } = req.params;
//       const bill = await billService.getBillById(id);
//       return res.status(200).json({ success: true, data: bill });
//     } catch (err) {
//       return res.status(404).json({ success: false, message: err.message });
//     }
//   }

//   async getAllBills(req, res) {
//     try {
//       const {
//         includeInactive = false,
//         search,
//         page = 1,
//         limit = 10,
//         orderBy = "createdAt",
//         order = "asc",
//       } = req.query;

//       const bills = await billService.getAllBills({
//         includeInactive: includeInactive === "true",
//         search,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         orderBy,
//         order,
//       });

//       return res.status(200).json({ success: true, ...bills });
//     } catch (err) {
//       return res.status(500).json({ success: false, message: err.message });
//     }
//   }


//   async deleteBill(req, res) {
//     try {
//       const { id } = req.params;
//       const result = await billService.deleteBill(id);
//       return res.status(200).json({ success: true, ...result });
//     } catch (err) {
//       return res.status(404).json({ success: false, message: err.message });
//     }
//   }
// }

// export default new BillController();




// import Orders from "../models/order.models.js";  
// import OrderItems from "../models/order_items.models.js"; 
// import Bills from "../models/bills.models.js"; 
// import billService from "../service/bill.service.js";  

// class BillController {
//   // 🔹 Generate a bill for an order
//   async generateBill(req, res) {
//     try {
//       const { order_id, room_id, total_amount, createdBy } = req.body;

//       if (!order_id || !room_id || !total_amount) {
//         return res.status(400).json({
//           success: false,
//           message: "Missing required fields"
//         });
//       }

//       // Ensure you're passing the UUID directly
//       const order = await Orders.findByPk(order_id, {
//         include: [{ model: OrderItems, as: "items" }],
//       });

//       if (!order) throw new Error("Order not found");

//       // Calculate total amount based on the order items
//       const totalAmount = order.items.reduce(
//         (acc, item) => acc + item.price * item.quantity,
//         0
//       );

//       // Create new bill
//       const bill = await Bills.create({
//         order_id,
//         room_id,
//         total_amount: totalAmount,
//         payment_status: "unpaid",
//         createdBy,
//       });

//       return res.status(201).json({
//         success: true,
//         message: "Bill generated successfully",
//         data: bill,
//       });
//     } catch (err) {
//       return res.status(500).json({
//         success: false,
//         message: err.message || "Failed to generate bill"
//       });
//     }
//   }

//   // 🔹 Get a bill by ID
//   async getBillById(req, res) {
//     try {
//       const { id } = req.params;
//       const bill = await billService.getBillById(id);

//       if (!bill)
//         return res.status(404).json({
//           success: false,
//           message: "Bill not found",
//         });

//       return res.status(200).json({
//         success: true,
//         data: bill,
//       });
//     } catch (err) {
//       return res
//         .status(500)
//         .json({ success: false, message: err.message || "Failed to fetch bill" });
//     }
//   }

//   // 🔹 Get all bills (with pagination, filtering, search)
//   async getAllBills(req, res) {
//     try {
//       const {
//         search = "",
//         includeInactive = false,
//         page = 1,
//         limit = 10,
//         orderBy = "createdAt",
//         order = "desc",
//       } = req.query;

//       const result = await billService.getAllBills({
//         search,
//         includeInactive: includeInactive === "true",
//         page: parseInt(page),
//         limit: parseInt(limit),
//         orderBy,
//         order,
//       });

//       return res.status(200).json({
//         success: true,
//         ...result,
//       });
//     } catch (err) {
//       return res
//         .status(500)
//         .json({ success: false, message: err.message || "Failed to fetch bills" });
//     }
//   }

//   // 🔹 Update payment status or bill info
//   async updateBill(req, res) {
//     try {
//       const { id } = req.params;
//       const updateData = req.body;

//       const bill = await billService.updateBill(id, updateData);

//       return res.status(200).json({
//         success: true,
//         message: "Bill updated successfully",
//         data: bill,
//       });
//     } catch (err) {
//       return res
//         .status(400)
//         .json({ success: false, message: err.message || "Failed to update bill" });
//     }
//   }

//   // 🔹 Delete (soft delete) bill
//   async deleteBill(req, res) {
//     try {
//       const { id } = req.params;

//       const result = await billService.deleteBill(id);

//       return res.status(200).json({
//         success: true,
//         message: "Bill deleted successfully",
//         data: result,
//       });
//     } catch (err) {
//       return res
//         .status(404)
//         .json({ success: false, message: err.message || "Bill not found" });
//     }
//   }
// }

// export default new BillController();

import Orders from "../models/order.models.js";  
import OrderItems from "../models/order_items.models.js"; 
import Bills from "../models/bills.models.js"; 
import billService from "../service/bill.service.js";  

class BillController {
  // 🔹 Generate a bill for an order
  async generateBill(req, res) {
    try {
      const { order_id, room_id, createdBy } = req.body;

      if (!order_id || !room_id) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Fetch order WITH ORDER ITEMS using correct alias
      const order = await Orders.findByPk(order_id, {
        include: [
          {
            model: OrderItems,
            as: "orderItems", // FIXED alias
          },
        ],
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Calculate total amount from order items
      const totalAmount = order.orderItems.reduce((acc, item) => {
        return acc + Number(item.price) * Number(item.quantity);
      }, 0);

      // Create Bill
      const bill = await Bills.create({
        order_id,
        room_id,
        total_amount: totalAmount,
        payment_status: "unpaid",
        createdBy,
      });

      return res.status(201).json({
        success: true,
        message: "Bill generated successfully",
        data: bill,
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to generate bill",
      });
    }
  }

  // 🔹 Get a bill by ID
  async getBillById(req, res) {
    try {
      const { id } = req.params;
      const bill = await billService.getBillById(id);

      if (!bill) {
        return res.status(404).json({
          success: false,
          message: "Bill not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: bill,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch bill",
      });
    }
  }

  // 🔹 Get all bills
  async getAllBills(req, res) {
    try {
      const {
        search = "",
        includeInactive = false,
        page = 1,
        limit = 10,
        orderBy = "createdAt",
        order = "desc",
      } = req.query;

      const result = await billService.getAllBills({
        search,
        includeInactive: includeInactive === "true",
        page: Number(page),
        limit: Number(limit),
        orderBy,
        order,
      });

      return res.status(200).json({
        success: true,
        ...result,
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch bills",
      });
    }
  }

  // 🔹 Update bill
  async updateBill(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const bill = await billService.updateBill(id, updateData);

      return res.status(200).json({
        success: true,
        message: "Bill updated successfully",
        data: bill,
      });

    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to update bill",
      });
    }
  }

  // 🔹 Delete bill
  async deleteBill(req, res) {
    try {
      const { id } = req.params;
      const result = await billService.deleteBill(id);

      return res.status(200).json({
        success: true,
        message: "Bill deleted successfully",
        data: result,
      });

    } catch (err) {
      return res.status(404).json({
        success: false,
        message: err.message || "Bill not found",
      });
    }
  }
}

export default new BillController();

