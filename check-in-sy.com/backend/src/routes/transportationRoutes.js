import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";

import {
    calculateAndListServices,
    createBookingDirect,
    getUserTransportBookings,
    getSingleTransportBooking,getAllTransportBookingsForAdmin
} from "../controllers/transportationController.js";

const router = express.Router();
router.get("/admin/transport/bookings", verifyToken, getAllTransportBookingsForAdmin);

router.post("/transport/calculate-and-list", verifyToken, calculateAndListServices);

// تنفيذ الحجز
router.post("/transport/bookings/direct", verifyToken, createBookingDirect);

// عرض كل حجوزات المستخدم
router.get("/transport/bookings", verifyToken, getUserTransportBookings);

// عرض تفاصيل حجز واحد
router.get("/transport/bookings/:booking_id", verifyToken, getSingleTransportBooking);

export default router;
    