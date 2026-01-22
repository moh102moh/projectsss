import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getUserBookings,
  getUserCurrentBooking,
  
   getBookingsByHotel,
  getRoomsWithBookingsByHotel,
  getOwnerHotels,
  getUserCart,
  deleteFromCart,getTopHotels
} from "../controllers/bookingController.js";

import { verifyToken ,verifyHotelOwner} from "../middlewares/authMiddleware.js";   


const router = express.Router();


router.post("/", verifyToken, createBooking);


router.get("/", /* requireAdmin, */ getAllBookings);

router.get("/hotel", verifyToken, verifyHotelOwner, getOwnerHotels);

// جلب الحجوزات لفندق معين (التحقق: مالك أو أدمن)
router.get("/hotel/:hotelId", verifyToken, verifyHotelOwner, getBookingsByHotel);
router.get("/top", getTopHotels);
// جلب الغرف مع عدد الحجوزات
router.get("/hotel/:hotelId/rooms", verifyToken, verifyHotelOwner, getRoomsWithBookingsByHotel);
router.get("/cart", verifyToken, getUserCart);
// جلب الحجوزات حسب الفندق
// في bookingRoutes.js أو ملف الراوتر



// تعديل بيانات الحجز



router.delete("/cart/:id", verifyToken, deleteFromCart);
// حجوزات المستخدم الحالي
router.get("/user", verifyToken, getUserBookings);

// الحجز الحالي للمستخدم
router.get("/user/current", verifyToken, getUserCurrentBooking);

// جلب حجز حسب id (يسمح للأدمن أو صاحب الحجز)
router.get("/:id", verifyToken, getBookingById);


// تحديث حالة الحجز (owner أو admin)
router.put("/:id/status", verifyToken, updateBookingStatus);

// حذف حجز (owner أو admin)
router.delete("/:id", verifyToken, deleteBooking);


// عرض السلة

export default router;
