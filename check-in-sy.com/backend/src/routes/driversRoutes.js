// src/routes/driversRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  createDriver,
  updateDriver,
  deleteDriver,
  getAllDrivers,
  getDriverById
} from "../controllers/driversController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ------- مسار تخزين ملفات السائقين -------
const DRIVERS_DIR = path.join(__dirname, "..", "uploads", "drivers");
fs.mkdirSync(DRIVERS_DIR, { recursive: true });

// ------- إعدادات Multer -------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, DRIVERS_DIR),
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  },
});

const upload = multer({ storage });

// ------- Routes -------

// إنشاء سائق جديد + رفع صورة
router.post("/", upload.single("driver_image"), createDriver);

// تحديث بيانات السائق + تحديث صورة إذا وُجدت
router.put("/:id", upload.single("driver_image"), updateDriver);

// حذف سائق
router.delete("/:id", deleteDriver);

// عرض كل السائقين
router.get("/", getAllDrivers);

// عرض سائق واحد
router.get("/:id", getDriverById);

export default router;
