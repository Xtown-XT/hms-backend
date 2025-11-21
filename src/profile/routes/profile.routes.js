import express from "express";
import * as ProfileController from "../controller/profile.controller.js";
import * as ProfileDto from "../dto/profile.dto.js";
import { validate } from "../../middleware/index.js";
import { uploadProfile } from "../../middleware/upload.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = express.Router();

// ------------------ CREATE PROFILE ------------------
router.post(
  "/createprofile",
  verifyToken,
  authorizeRole(["admin"]),
  uploadProfile.single("profile_image"), // Multer for profile image
  validate({ body: ProfileDto.createProfileSchema }),
  ProfileController.create
);

// ------------------ GET ALL PROFILES ------------------
router.get(
  "/getallprofile",
  verifyToken,
  authorizeRole(["admin"]),
  ProfileController.getAll
);

// ------------------ GET PROFILE BY ID ------------------
router.get(
  "/profile/:profile_id",
  verifyToken,
  authorizeRole(["admin"]),
  ProfileController.getById
);

// ------------------ UPDATE PROFILE ------------------
router.put(
  "/updateprofile/:profile_id",
  verifyToken,
  authorizeRole(["admin"]),
  uploadProfile.single("profile_image"), // Multer for profile image
  validate({ body: ProfileDto.updateProfileSchema }),
  ProfileController.update
);

// ------------------ DELETE PROFILE ------------------
router.delete(
  "/deleteprofile/:profile_id",
  verifyToken,
  authorizeRole(["admin"]),
  ProfileController.remove
);

// ------------------ RESTORE PROFILE ------------------
router.patch(
  "/profile/restore/:profile_id",
  verifyToken,
  authorizeRole(["admin"]),
  ProfileController.restore
);

export default router;
