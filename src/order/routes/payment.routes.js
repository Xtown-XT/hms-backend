
import { Router } from "express";
import {
  createPaymentController,
  getPaymentsController,
  getPaymentByIdController,
  updatePaymentController,
  deletePaymentController,
} from "../controller/payment.controller.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";
const router = Router();

router.post("/payment/createPayment", verifyToken, authorizeRole(["admin"]) , createPaymentController);
router.get("/payment/getPayments", verifyToken, authorizeRole(["admin"]) , getPaymentsController);
router.get("/payment/getPaymentById/:id",verifyToken, authorizeRole(["admin"]) , getPaymentByIdController);
router.put("/payment/updatePayment/:id", verifyToken, authorizeRole(["admin"]) , updatePaymentController);
router.delete("/payment/deletePayment/:id",verifyToken, authorizeRole(["admin"]) , deletePaymentController);

export default router;
