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
  "/guests/:id",
  verifyToken,
  authorizeRole(["admin"]),
  validate({ body: updateGuestSchema }),
  GuestController.updateGuest
);

/* ---------------------- SINGLE DELETE GUEST ---------------------- */
router.delete(
  "/guests/:id",
  verifyToken,
  authorizeRole(["admin"]),
  validate({ body: deleteGuestSchema }), // optional body but valid
  GuestController.deleteGuest
);

/* ---------------------- BULK DELETE GUESTS ---------------------- */
router.delete(
  "/deleteguests",
  verifyToken,
  authorizeRole(["admin"]),
  validate({ body: deleteGuestSchema }),
  GuestController.deleteGuest
);

/* ---------------------- RESTORE GUEST ---------------------- */
router.patch(
  "/guests/restore/:id",
  verifyToken,
  authorizeRole(["admin"]),
  GuestController.restoreGuest
);

export default router;
