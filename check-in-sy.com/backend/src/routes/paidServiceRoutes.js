import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/paidServiceController.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // تأكد أن هذا المسار صحيح بالنسبة لملف الروتر
    cb(null, path.join(process.cwd(), "src", "uploads", "paid_services")); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `service-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });
router.get("/", getAllServices); 
// ملاحظة: قمت بتغيير مسارات get و post و put لتتوافق مع كود الواجهة
// الذي استخدمت فيه /api/paid-services/all و /api/paid-services/create

// المسار القديم: router.get("/", getAllServices);
// المسار الجديد ليناسب الواجهة:
// سيصبح المسار كاملاً: /api/paid-services/all
router.get("/:id", getServiceById);

// المسار القديم: router.post("/", upload.array("images", 10), createService);
// المسار الجديد ليناسب الواجهة:
router.post("/create", upload.array("images", 10), createService); // سيصبح المسار كاملاً: /api/paid-services/create

// المسار القديم: router.put("/:id", upload.array("images", 10), updateService);
router.put("/:id", upload.array("images", 10), updateService); // يبقي كما هو

// المسار القديم: router.delete("/:id", deleteService);
router.delete("/:id", deleteService); // يبقي كما هو

export default router;