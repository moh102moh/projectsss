// src/routes/specialOffersRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  createSpecialOffer,
  updateSpecialOffer,
  deleteSpecialOffer,
  getAllSpecialOffers,
  getSpecialOfferById
} from "../controllers/specialOffersController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// path -> project/src/uploads/special_offers
const OFFERS_DIR = path.join(__dirname, "..", "uploads", "special_offers");
fs.mkdirSync(OFFERS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, OFFERS_DIR),
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), createSpecialOffer);
router.put("/:id", upload.single("image"), updateSpecialOffer);
router.delete("/:id", deleteSpecialOffer);
router.get("/", getAllSpecialOffers);
router.get("/:id", getSpecialOfferById);

export default router;
