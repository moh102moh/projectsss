import express from "express";
import { addFavorite, removeFavorite, getUserFavorites } from "../controllers/favoritesController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // توكن المستخدم

const router = express.Router();

router.post("/", verifyToken, addFavorite);
router.delete("/:hotel_id", verifyToken, removeFavorite);
router.get("/my", verifyToken, getUserFavorites);

export default router;
