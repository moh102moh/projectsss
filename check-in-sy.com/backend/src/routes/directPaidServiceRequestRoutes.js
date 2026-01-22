import express from "express";
import { createRequest, getRequests, deleteRequest , updateRequest} from "../controllers/directPaidServiceRequestController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, createRequest);
router.put("/:id", verifyToken, updateRequest);
router.get("/all", verifyToken, getRequests);
router.delete("/:id", verifyToken, deleteRequest);

export default router;
