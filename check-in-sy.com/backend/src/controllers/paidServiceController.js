import fs from "fs";
import path from "path";
import * as PaidService from "../models/paidServiceModel.js";

const UPLOADS_PUBLIC_PREFIX = "/uploads";
const UPLOADS_FS_ROOT = path.join(process.cwd(), "src", "uploads", "paid_services");

// إنشاء المجلد لو غير موجود
if (!fs.existsSync(UPLOADS_FS_ROOT)) fs.mkdirSync(UPLOADS_FS_ROOT, { recursive: true });

// 🟩 عرض كل الخدمات
export const getAllServices = async (req, res) => {
  try {
    const services = await PaidService.getAllPaidServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟩 إنشاء خدمة جديدة مع صور
export const createService = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) return res.status(400).json({ message: "الحقول المطلوبة ناقصة" });

    let images = [];

    // رفع الصور إن وجدت
    if (req.files && Array.isArray(req.files)) {
      images = req.files.map((file) => `${UPLOADS_PUBLIC_PREFIX}/paid_services/${file.filename}`);
    }

    const serviceId = await PaidService.createPaidService(name, images, description || "", price);
    res.status(201).json({ message: "تم إنشاء الخدمة بنجاح", serviceId, images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟩 تحديث خدمة
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, active, image_paths } = req.body;

    const fieldsToUpdate = {};

    if (name) fieldsToUpdate.name = name;
    if (description) fieldsToUpdate.description = description;
    if (price) fieldsToUpdate.price = price;
    if (active !== undefined) fieldsToUpdate.active = active;

    // معالجة الصور
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/paid_services/${file.filename}`);
      fieldsToUpdate.images = JSON.stringify(images);
    } else if (image_paths) {
      try {
        const parsed = typeof image_paths === "string" ? JSON.parse(image_paths) : image_paths;
        if (Array.isArray(parsed)) fieldsToUpdate.images = JSON.stringify(parsed);
      } catch {
        // تجاهل الخطأ
      }
    }

    if (Object.keys(fieldsToUpdate).length === 0)
      return res.status(400).json({ message: "لا توجد بيانات لتحديثها" });

    await PaidService.updatePaidService(id, fieldsToUpdate);

    res.json({ message: "تم تعديل الخدمة بنجاح" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟩 حذف خدمة
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await PaidService.deletePaidService(id);
    res.json({ message: "تم حذف الخدمة بنجاح" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await PaidService.getPaidServiceById(id);

    if (!service) {
      return res.status(404).json({ message: "الخدمة غير موجودة" });
    }

    // تأكد أن حقل الصور يتحول من JSON إلى Array قبل الإرسال
    if (service.images) {
      try {
        service.images = JSON.parse(service.images);
      } catch {
        service.images = [];
      }
    } else {
      service.images = [];
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};