// import QRCode from "../model/qr.model.js";
// import qrcode from "qrcode";

// // ✅ Create QR
// const createQr = async (req, res) => {
//   try {
//     const { table } = req.body;
//     if (!table) return res.status(400).json({ error: "Table No  is required" });

//     const qrCodeUrl = await qrcode.toDataURL(table);

//     const newQR = await QRCode.create({ table, qrCodeUrl });

//     return res.status(201).json(newQR);
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Get all QR
// const getQrs = async (req, res) => {
//   try {
//     const qrs = await QRCode.findAll();
//     res.json(qrs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Get QR by ID
// const getQrById = async (req, res) => {
//   try {
//     const qr = await QRCode.findByPk(req.params.id);
//     if (!qr) return res.status(404).json({ error: "QR not found" });
//     res.json(qr);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Update QR
// const updateQr = async (req, res) => {
//   try {
//     const { table } = req.body;
//     const qr = await QRCode.findByPk(req.params.id);

//     if (!qr) return res.status(404).json({ error: "QR not found" });

//     const qrCodeUrl = await qrcode.toDataURL(table);
//     await qr.update({ table, qrCodeUrl });

//     return res.status(200).json(qr);
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Delete QR
// const deleteQr = async (req, res) => {
//   try {
//     // const qr = await QRCode.findByPk(req.params.id);
//     // if (!qr) return res.status(404).json({ error: "QR not found" });

//     // await qr.destroy();
//     // res.json({ message: "QR deleted" });


//     const [updated] = await QRCode.update(
//       { is_active: false },  // fields to update
//       { where: { id: req.params.id } }  // condition
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "QR not found" });
//     }

//     return res.json({ message: "Qr deactivated successfully" });


//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export default {
//   createQr,
//   getQrs,
//   getQrById,
//   updateQr,
//   deleteQr,
// };


import {
  createQrService,
  getQrByIdService,
  updateQrService,
  deleteQrService,
  getQrsService,
} from "../service/qr.service.js";

import {
  createQrSchema,
  updateQrSchema,
  getQrsQuerySchema,
  qrIdParamSchema,
} from "../dto/qr.dto.js";

// Create QR
export const createQrController = async (req, res) => {
  try {
    const validated = createQrSchema.parse(req.body);
    const qr = await createQrService(validated);
    res.status(201).json({ success: true, data: qr });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get QR by ID
export const getQrByIdController = async (req, res) => {
  try {
    const { id } = qrIdParamSchema.parse(req.params);
    const qr = await getQrByIdService(id);
    res.json({ success: true, data: qr });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

// Update QR
export const updateQrController = async (req, res) => {
  try {
    const { id } = qrIdParamSchema.parse(req.params);
    const validated = updateQrSchema.parse(req.body);
    const qr = await updateQrService(id, validated, validated.updated_by);
    res.json({ success: true, data: qr });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete QR
// export const deleteQrController = async (req, res) => {
//   try {
//     const { id } = qrIdParamSchema.parse(req.params);
//     // const { userId } = req.body;
//     // await deleteQrService(id, userId);
//     await deleteQrService(id);
//     res.json({ success: true, message: "QR deleted successfully" });
//   } catch (err) {
//     res.status(404).json({ success: false, error: err.message });
//   }
// };


export const deleteQrController = async (req, res) => {
  try {
    const { id } = qrIdParamSchema.parse(req.params);
    // const { userId } = req.body; // optional, who deleted it

    await deleteQrService(id);
    // await deleteQrService(id, userId);

    res.json({ success: true, message: "QR deactivated successfully" });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};


// Get all QRs
export const getQrsController = async (req, res) => {
  try {
    const query = getQrsQuerySchema.parse(req.query);
    const result = await getQrsService(query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

