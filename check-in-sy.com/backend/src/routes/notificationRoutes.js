import express from "express";
import { saveToken, getAllTokens,getUserTokens,getUserNotifications  } from "../controllers/notificationController.js";
import { verifyUserToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/save-token", saveToken);
router.get("/my-notifications",verifyUserToken, getUserNotifications);
router.get("/all-tokens", getAllTokens); 
router.get("/my-tokens", getUserTokens); 

export default router;
