import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// حتى نقدر نستخدم __dirname داخل ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// دالة عامة لإنشاء تخزين لمجلد معين داخل src/uploads
const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, `../uploads/${folder}`);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

// 🔹 فلتر أنواع الملفات (بس صور)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("❌ Only image files are allowed!"), false);
};

// 🔹 تصدير أكثر من نوع Upload حسب المكان
export const uploadHotel = multer({ storage: createStorage("hotels"), fileFilter });
export const uploadRoom = multer({ storage: createStorage("rooms"), fileFilter });
export const uploadOffer = multer({ storage: createStorage("offers"), fileFilter });
export const uploadAmenity = multer({ storage: createStorage("special_offers"), fileFilter });
export const uploadAdditionalService = multer({ storage: createStorage("additional-services"), fileFilter });

// 🔹 وهاد لو بدك Upload عام لمكان افتراضي
const upload = multer({ storage: createStorage("misc"), fileFilter });
export default upload;
