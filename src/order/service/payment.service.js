import Payments from "../models/payment.model.js";
import Order from "../models/order.models.js";
import { Op } from "sequelize";

// Create Payment
export async function createPaymentService(data) {
  const balance = data.balance ?? (data.bill_amount - data.amount_received);

  const payment = await Payments.create({
    order_id: data.order_id || null,
    bill_id: data.bill_id || null,
    bill_amount: data.bill_amount,
    amount_received: data.amount_received,
    // balance: balance,
    method: data.method || "CASH",
    status: "SUCCESS",
    created_by: data.created_by || null,
    updated_by: data.created_by || null,
  });

  return payment;
}


// Get by ID
export async function getPaymentByIdService(id) {
  const payment = await Payments.findByPk(id
  //   , {
  //   include: [
  //     { model: QRCode, attributes: ["table"] },
  //     { model: Order, attributes: ["order_code", "status"] },
  //   ],
  // }
  );
  if (!payment || !payment.is_active) throw new Error("Payment not found");
  return payment;
}

// Update by ID
export async function updatePaymentService(id, data, userId) {
  const payment = await Payments.findByPk(id);
  if (!payment || !payment.is_active) throw new Error("Payment not found");

  if (data.bill_amount !== undefined) payment.bill_amount = data.bill_amount;
  if (data.method) payment.method = data.method;
  if (data.status) payment.status = data.status;
  if (data.transactionId) payment.transactionId = data.transactionId;

  payment.updated_by = userId || null;
  await payment.save();
  await payment.reload();
  return payment;
}

// Soft delete
export async function deletePaymentService(id, userId) {
  const payment = await Payments.findByPk(id);
  if (!payment || !payment.is_active) throw new Error("Payment not found");

  payment.is_active = false;
  payment.deleted_by = userId || null;
  await payment.save();
  return payment;
}

// Get all Payments
export async function getPaymentsService({
  includeInactive = false,
  search,
  page,
  limit,
  orderBy = "createdAt",
  order = "asc",
} = {}) {
  const where = {};
  if (!includeInactive) where.is_active = true;

  if (search) {
    where[Op.or] = [
      { status: { [Op.like]: `%${search}%` } },
      { method: { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = page && limit ? (page - 1) * limit : undefined;
  const limitVal = page && limit ? limit : undefined;

  const rows = await Payments.findAll({
    where,
    offset,
    limit: limitVal,
    order: [[orderBy, order.toUpperCase()]],
    // include: [
    //   { model: QRCode, attributes: ["table"] },
    //   { model: Order, attributes: ["order_code", "status"] },
    // ],
  });

  const count = await Payments.count({ where });

  return { rows, count };
}
