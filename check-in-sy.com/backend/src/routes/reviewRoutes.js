import express from "express";
import {
  addReview,
  updateReview,
  deleteReview,
  getReviewsByHotel,
  getReviewById
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", addReview);
router.put("/:id", updateReview); 
router.delete("/:id", deleteReview); 
router.get("/hotel/:hotelId", getReviewsByHotel); 
router.get("/:id", getReviewById); 

export default router;
