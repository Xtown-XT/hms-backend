import { Router } from 'express';
import BillController from '../controller/bill.controller.js';
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

// Use the correct route prefix (ensure it's consistent with what you expect)
router.post('/createbill', BillController.generateBill);

// Add other routes here
router.get('/bill', verifyToken, authorizeRole(["admin"]), BillController.getAllBills);
router.get('/bill/:id', verifyToken, authorizeRole(["admin"]), BillController.getBillById);
router.delete('/bill/:id', verifyToken, authorizeRole(["admin"]), BillController.deleteBill);

export default router;
