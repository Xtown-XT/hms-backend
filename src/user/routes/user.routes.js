import { Router } from "express";
import userController from "../controller/user.controller.js";
import { verifyToken, authorizeRole } from "../../middleware/index.js";

const router = Router();

// Public routes
router.post("/user/register", userController.createUser);
router.post("/user/login", userController.loginUser);


// Protected routes 
router.get("/user", verifyToken, authorizeRole(["admin"]), userController.getAllUsers);
router.get("/user/:id", verifyToken, authorizeRole(["admin"]), userController.getUserById);
router.get("/users/me", verifyToken, authorizeRole(["admin", "user"]), userController.getCurrentUser);

router.put("/user/:id", verifyToken, authorizeRole(["admin"]), userController.updateUserById);
router.delete("/user/:id", verifyToken, authorizeRole(["admin"]), userController.softDeleteUser);
router.patch("/user/:id/restore", verifyToken, authorizeRole(["admin"]), userController.restoreUser);

export default router;
