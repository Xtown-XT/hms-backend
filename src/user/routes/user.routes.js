import { Router } from "express";
import userController from "../controller/user.controller.js";
// (optionally) import authMiddleware to protect routes

const router = Router();

router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);

router.get("/me/profile", userController.getMe);
router.post("/login", userController.loginUser);

router.put("/:id", userController.updateUserById);
router.delete("/:id", userController.softDeleteUser);
router.patch("/:id/restore", userController.restoreUser);

router.post("/refresh-token", userController.refreshAccessToken);
router.post("/logout", userController.logoutUser);

router.post("/send-otp", userController.sendOtpToken);
router.get("/exists", userController.userAlreadyExists);

router.post("/change-password", userController.changePassword);

export default router;
