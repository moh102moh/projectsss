import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  loginHotel,
  getHotelForDashboard,
  updateHotelByAdmin,
  getHotelRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getAmenitiesByHotel,
  addAmenity,
  editAmenity,
  removeAmenity,
  getHotelOffers,
  addHotelOffer,
  updateHotelOffer,
  deleteHotelOffer,
  createAdditionalService,
  updateAdditionalService,
  deleteAdditionalService,
  getHotelAdditionalServices,
  getReviewsByHotel,
  getHotelFullById,
  getRoomImages,
  addRoomImage,
  updateRoomImage,
  deleteRoomImage,getAdminNotifications,getHotelNotifications, markNotificationRead
} from "../controllers/hotelAdminController.js";

import { verifyHotelToken,verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ================= إعداد multer للصور =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createStorage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, `../uploads/${folder}`);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

const uploadRoom = multer({ storage: createStorage("rooms") });
const uploadOffer = multer({ storage: createStorage("offers") });
const uploadAmenity = multer({ storage: createStorage("amenities") });
const uploadAdditionalService = multer({ storage: createStorage("additional-services") });
const uploadHotel = multer({ storage: createStorage("hotels") });


// ==================== المسارات ====================

// تسجيل دخول الفندق
router.post("/login", loginHotel);

// لوحة تحكم الفندق
router.get("/dashboard", verifyHotelToken, getHotelForDashboard);
router.put("/dashboard", verifyHotelToken, uploadHotel.single("image"), updateHotelByAdmin);

router.get("/notifications",verifyToken, getAdminNotifications);
router.post("/mark-read", verifyToken, markNotificationRead);
router.get("/notificationss", verifyToken, getHotelNotifications);


// الغرف
router.get("/rooms", verifyHotelToken, getHotelRooms);
router.post("/rooms", verifyHotelToken, uploadRoom.array("images", 10), createRoom);
router.put("/rooms/:id", verifyHotelToken, updateRoom);
router.delete("/rooms/:id", verifyHotelToken, deleteRoom);

// صور الغرف
router.get("/rooms/:roomId/images", getRoomImages);
router.post("/rooms/:roomId/images", verifyHotelToken, uploadRoom.single("image"), addRoomImage);
router.put("/room-images/:imageId", verifyHotelToken, updateRoomImage);
router.delete("/room-images/:imageId", verifyHotelToken, deleteRoomImage);

// الخدمات (Amenities)
router.get("/amenities", verifyHotelToken, getAmenitiesByHotel);
router.post("/amenities", verifyHotelToken, uploadAmenity.single("image"), addAmenity);
router.put("/amenities/:id", verifyHotelToken, editAmenity);
router.delete("/amenities/:id", verifyHotelToken, removeAmenity);

// العروض (Offers) بدون توكن للعرض العام
router.get("/offers", getHotelOffers); // فقط عرض
router.post("/offers", verifyHotelToken, uploadOffer.single("image"), addHotelOffer);
router.put("/offers/:id", verifyHotelToken, uploadOffer.single("image"), updateHotelOffer)
router.delete("/offers/:id", verifyHotelToken, deleteHotelOffer);

// الخدمات الإضافية (Additional Services)
router.get("/additional-services", verifyHotelToken, getHotelAdditionalServices);
router.post("/additional-services", verifyHotelToken, uploadAdditionalService.single("image"), createAdditionalService);
router.put("/additional-services/:id", verifyHotelToken, updateAdditionalService);
router.delete("/additional-services/:id", verifyHotelToken, deleteAdditionalService);

// التقييمات
router.get("/reviews/:hotelId", getReviewsByHotel);

// إدارة الفنادق (للمشرف)
router.get("/admin/hotels/:id", getHotelFullById);

export default router;
