import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import hotlsRoutes from "./routes/hotlsRoutes.js";
import roomsRoutes from "./routes/roomsRoutes.js";
import hotelAdditionalServicesRoutes from "./routes/hotelAdditionalServicesRoutes.js";
import paidServiceRoutes from "./routes/paidServiceRoutes.js";
import bookingPaidServiceRoutes from "./routes/bookingPaidServiceRoutes.js";
import directPaidServiceRequestRoutes from "./routes/directPaidServiceRequestRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

import specialOffersRoutes from "./routes/specialOffersRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import hotelAdminRoutes from "./routes/hotelAdminRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import commonIssuesRoutes from "./routes/commonIssuesRoutes.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";
import transportRoutes from './routes/transportServiceRoute.js'; 
import transportRoute from './routes/transportationRoutes.js'; 
import driversRoutes from "./routes/driversRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
const app = express();
app.use(cors({
 // أو ضع رابط موقعك (Front-end) هنا
 origin: 'https://app.check-in-sy.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // تأكد من السماح بكل الطرق
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // السماح بـ Token
    credentials: true // ضروري للسماح بملفات تعريف الارتباط (Cookies) إذا كنت تستخدمها
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsRoot = path.join(process.cwd(), "uploads");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")));





app.use("/api/auth", authRoutes);
app.use("/api/hotls", hotlsRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/hotel-services", hotelAdditionalServicesRoutes);
app.use("/api/paid-services", paidServiceRoutes);
app.use("/api/booking-services", bookingPaidServiceRoutes);
app.use("/api/direct-services", directPaidServiceRequestRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/special-offers", specialOffersRoutes);
app.use("/api/hotel-admin", hotelAdminRoutes)
app.use("/api/support", supportRoutes);
app.use("/api/support/common", commonIssuesRoutes);

app.use("/api/favorites", favoritesRoutes);

app.use("/api/transports", transportRoutes);
app.use("/api/transportsCar", transportRoute);
app.use("/api/drivers", driversRoutes);

app.use("/api/notifications", notificationRoutes);
app.get("/", (req, res) => {
  res.send("✅ Check in Syria Backend is running");
});

export default app;