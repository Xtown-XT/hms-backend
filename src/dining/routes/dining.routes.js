// import express from "express";
// import * as DiningTableController from "../controller/dining.controller.js";
// import { verifyToken, authorizeRole } from "../../middleware/index.js";

// const router = express.Router();

// // ✅ Create Dining Table (admin access only)
// router.post(
//   "/dining-table",
//   verifyToken,  
//   authorizeRole(["admin"]),  
//   DiningTableController.create
// );

// // ✅ Get All Dining Tables (admin access only)
// router.get(
//   "/dining-table",
//   verifyToken,  
//   authorizeRole(["admin"]),  
//   DiningTableController.getAll
// );

// // ✅ Get Dining Table by ID (admin access only)
// router.get(
//   "/dining-table/:id",
//   verifyToken,  
//   authorizeRole(["admin"]),  
//   DiningTableController.getById
// );

// // ✅ Update Dining Table (admin access only)
// router.put(
//   "/dining-table/:id",
//   verifyToken,  
//   authorizeRole(["admin"]), 
//   DiningTableController.update
// );

// // ✅ Delete Dining Table (soft delete, admin access only)
// router.delete(
//   "/dining-table/:id",
//   verifyToken,  
//   authorizeRole(["admin"]),  
//   DiningTableController.remove
// );


// export default router;


import { Router } from 'express';
import { DiningTableController } from '../controller/dining.controller.js';
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

router.post('/dining-table', verifyToken, authorizeRole(["admin"]), DiningTableController.create);
router.get('/dining-table', verifyToken, authorizeRole(["admin"]), DiningTableController.findAll);
router.get('/dining-table/:id', verifyToken, authorizeRole(["admin"]), DiningTableController.findById);
router.put('/dining-table/:id', verifyToken, authorizeRole(["admin"]), DiningTableController.update);
router.delete('/dining-table/:id', verifyToken, authorizeRole(["admin"]), DiningTableController.softDelete);
router.patch('/dining-table/:id/restore', verifyToken, authorizeRole(["admin"]), DiningTableController.restore);

export default router;
