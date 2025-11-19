// import { Router } from "express";
// import qrController from "../controller/qr.controller.js";

// const router = Router();

// router.post("/qr/createQr", qrController.createQr);
// router.get("/qr/getQrs", qrController.getQrs);
// router.get("/qr/getQrById/:id", qrController.getQrById);
// router.put("/qr/updateQr/:id", qrController.updateQr);
// router.delete("/qr/deleteQr/:id", qrController.deleteQr);

// export default router;
import express from "express";
import {
  createQrController,
  getQrByIdController,
  updateQrController,
  deleteQrController,
  getQrsController,
} from "../controller/qr.controller.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = express.Router();

// 📌 Create new QR

// router.get("/user", verifyToken, authorizeRole(["admin"]), userController.getUsers);

router.post("/qr/createQr", verifyToken, authorizeRole(["admin"]) ,createQrController);

//  Get all QR
router.get("/qr/getQrs",verifyToken, authorizeRole(["admin"]), getQrsController);

//  Get QR by ID
router.get("/qr/getQrById/:id", verifyToken, authorizeRole(["admin"]),getQrByIdController);

// Update QR
router.put("/qr/updateQr/:id",verifyToken, authorizeRole(["admin"]), updateQrController);

// Delete QR (soft delete)
router.delete("/qr/deleteQr/:id",verifyToken, authorizeRole(["admin"]), deleteQrController);

export default router;
