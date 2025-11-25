import { Router } from "express";
import * as GuestController from "../controller/guest.controller.js";
import { validate, verifyToken, authorizeRole } from "../../middleware/index.js";

import {
  createGuestSchema,
  updateGuestSchema,
  getGuestsQuerySchema,
  deleteGuestSchema
} from "../dto/guest.dto.js";

const router = Router();

/* ---------------------- CREATE GUEST ---------------------- */
router.post(
  "/createguest",
  verifyToken,
  authorizeRole(["admin"]),
  validate({ body: createGuestSchema }),
  GuestController.createGuest
);

/* ---------------------- GET ALL GUESTS ---------------------- */
router.get(
  "/guests",
  verifyToken,
  authorizeRole(["admin"]),
  validate({ query: getGuestsQuerySchema }),
  GuestController.getAllGuests
);

/* ---------------------- GET GUEST BY ID ---------------------- */
router.get(
  "/guests/:id",
  verifyToken,
  authorizeRole(["admin"]),
  GuestController.getGuestById
);

/* ---------------------- UPDATE GUEST ---------------------- */
router.put(
  "/updateguest/:id",
  verifyToken,
  authorizeRole(["admin"]),
  validate({ body: updateGuestSchema }),
  GuestController.updateGuest
);

/* ---------------------- SINGLE DELETE GUEST ---------------------- */
router.delete(
  "/deleteguest/:id",
  verifyToken,
  authorizeRole(["admin"]),
  validate({ params: deleteGuestSchema.shape.params }), // validate params only
  GuestController.deleteGuest
);





export default router;

