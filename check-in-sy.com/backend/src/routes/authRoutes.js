// src/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  getUsers,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  verifyEmail,
  sendResetCode,
  resetPassword,verifyResetCode 
} from "../controllers/authController.js";
import { verifyUserToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);

router.post("/forgot-password", sendResetCode);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-code", verifyResetCode);

router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/me", verifyUserToken, getMyProfile);
router.put("/me", verifyUserToken, updateMyProfile);
router.delete("/me", verifyUserToken, deleteMyAccount);

export default router;
