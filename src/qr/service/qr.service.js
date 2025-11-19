import QRCode from "../model/qr.model.js ";
import qrcode from "qrcode";
import { Op } from "sequelize";

// Create QR
export async function createQrService(data) {
  const qrCodeUrl = await qrcode.toDataURL(data.table);

  const qrPayload = {
    table: data.table,
    qrCodeUrl,
    is_active: true,
    created_by: data.created_by || null,
    updated_by: data.created_by || null,
  };

  const newQR = await QRCode.create(qrPayload);
  return newQR;
}

// Get by ID
export async function getQrByIdService(id) {
  const qr = await QRCode.findByPk(id);
  if (!qr || !qr.is_active) throw new Error("QR not found");
  return qr;
}

// Update by ID
export async function updateQrService(id, data, userId) {
  const qr = await QRCode.findByPk(id);
  if (!qr || !qr.is_active) throw new Error("QR not found");

  if (data.table) {
    qr.table = data.table;
    qr.qrCodeUrl = await qrcode.toDataURL(data.table);
  }

  qr.updated_by = userId || null;
  await qr.save();
  await qr.reload();
  return qr;
}

// Soft delete
export async function deleteQrService(id, userId) {
  const qr = await QRCode.findByPk(id);
  if (!qr || !qr.is_active) throw new Error("QR not found");

  qr.is_active = false;
  qr.deleted_by = userId || null;
  await qr.save();
  return qr;
}

// Get all QRs
export async function getQrsService({
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
      { table: { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = page && limit ? (page - 1) * limit : undefined;
  const limitVal = page && limit ? limit : undefined;

  const rows = await QRCode.findAll({
    where,
    offset,
    limit: limitVal,
    order: [[orderBy, order.toUpperCase()]],
  });

  const count = await QRCode.count({ where });

  return { rows, count };
}
