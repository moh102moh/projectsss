import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createHotel,
  updateHotel,
  deleteHotel,
  getAllHotels,
  getHotelById,
  searchHotels,
  addAmenity,
  updateAmenity,
  deleteAmenity,
  getAmenitiesByHotel,
  addHotelOffer,
  updateHotelOffer,
  deleteHotelOffer,
  getHotelOffers,
} from "../controllers/hotlsController.js";

const router = express.Router();

// ✅ إنشاء مجلدات التخزين لو ما موجودة
const createUploadsFolder = () => {
  const folders = ["src/uploads/hotels", "src/uploads/offers"];
  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  });
};
createUploadsFolder();

// --------------------
// Multer للفنادق
// --------------------
const hotelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "src/uploads/hotels"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const uploadHotels = multer({ storage: hotelStorage });

// --------------------
// Multer للعروض
// --------------------
const offerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "src/uploads/offers"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const uploadOffers = multer({ storage: offerStorage });

// --------------------
// Routes
// --------------------

// إنشاء فندق (مع صور)
router.post(
  "/create",
  (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      uploadHotels.array("images", 10)(req, res, next);
    } else {
      next();
    }
  },
  createHotel
);

// تعديل فندق
router.put("/:id", uploadHotels.array("images", 10), updateHotel);

// حذف فندق
router.delete("/:id", deleteHotel);

router.get("/search", searchHotels);
router.get("/", getAllHotels);
router.get("/:id", getHotelById);
router.get("/", getAllHotels);

// المرافق
router.post("/:hotelId/amenities", addAmenity);
router.put("/amenities/:amenityId", updateAmenity);
router.delete("/amenities/:amenityId", deleteAmenity);
router.get("/:hotelId/amenities", getAmenitiesByHotel);

// العروض
router.post("/:hotelId/offers", uploadOffers.single("image"), addHotelOffer);
router.put("/offers/:offerId", uploadOffers.single("image"), updateHotelOffer);
router.delete("/offers/:offerId", deleteHotelOffer);
router.get("/:hotelId/offers", getHotelOffers);

export default router;
