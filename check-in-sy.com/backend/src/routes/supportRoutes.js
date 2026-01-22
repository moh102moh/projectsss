import express from "express";
import { verifyUserToken } from "../middlewares/authMiddleware.js";
import {
  createTicket,
  getMyTickets,
  getAllSupportTickets,
  updateTicket,
} from "../controllers/supportController.js";

const router = express.Router();

// المستخدم (customer)
router.post("/", verifyUserToken, createTicket);
router.get("/my", verifyUserToken, getMyTickets);

// المشرف (admin)
router.get("/all", verifyUserToken, getAllSupportTickets);
router.put("/:id", verifyUserToken, updateTicket);

export default router;
