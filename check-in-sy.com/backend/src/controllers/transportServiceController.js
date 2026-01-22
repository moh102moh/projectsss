import db from "../config/db.js";
import path from 'path';
import fs from 'fs';

const UPLOADS_PUBLIC_PREFIX = "/uploads";
const UPLOADS_FS_ROOT = path.join(process.cwd(), "src", "uploads", "transport_services");

if (!fs.existsSync(UPLOADS_FS_ROOT)) {
    console.log(`Creating upload directory: ${UPLOADS_FS_ROOT}`);
    fs.mkdirSync(UPLOADS_FS_ROOT, { recursive: true });
}

// دالة التحقق من صلاحيات المدير (Admin Auth) - للاختبار
const checkAdminAuth = (req) => {
    req.user = { id: 99, role: 'admin', username: 'TestUser' };
    return req.user && (req.user.role === 'admin' || req.user.role === 'controller');
};

async function getTransportServiceDetails(serviceId) {
    const [rows] = await db.execute(
        "SELECT * FROM transport_services WHERE id = ?",
        [serviceId]
    );
    return rows.length ? rows[0] : null;
}

// ----------------- Admin / CRUD Operations -----------------

// 1. إضافة خدمة نقل جديدة (POST)
export const createTransportService = async (req, res) => {
    // ... (رمز الدالة createTransportService) ...
    if (!checkAdminAuth(req)) {
        return res.status(403).json({ message: "مطلوب صلاحيات مسؤول (Admin) لإجراء هذه العملية." });
    }

    let uploadedImagePath = null;
    try {
        const { service_type, name_en, name_ar, capacity, pricing_method, base_price, minimum_charge = 0, is_available = true, notes = null } = req.body;

        if (req.file) {
            uploadedImagePath = `${UPLOADS_PUBLIC_PREFIX}/transport_services/${req.file.filename}`;
        }
        
        const image_url = uploadedImagePath;

        if (!service_type || !name_ar || !name_en || !capacity || !pricing_method || typeof base_price === 'undefined') {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "الرجاء توفير كافة الحقول الإلزامية." });
        }

        if (!['Rental', 'Transfer'].includes(service_type) || !['Per_Day', 'Per_KM'].includes(pricing_method)) {
             if (req.file) fs.unlinkSync(req.file.path);
             return res.status(400).json({ message: "أنواع الخدمة والتسعير غير صالحة." });
        }
        
        const [result] = await db.execute(
            `INSERT INTO transport_services 
             (service_type, name_en, name_ar, capacity, is_available, pricing_method, base_price, minimum_charge, image_url, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [service_type, name_en, name_ar, capacity, is_available, pricing_method, base_price, minimum_charge, image_url, notes]
        );

        const newService = await getTransportServiceDetails(result.insertId);
        res.status(201).json({ message: "تمت إضافة خدمة النقل بنجاح.", service: newService });

    } catch (error) {
        console.error("createTransportService error:", error);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
    }
};

// 2. جلب جميع الخدمات (GET)
export const getAllTransportServices = async (req, res) => {
    try {
        const isAdmin = checkAdminAuth(req); 
        
        const [rows] = await db.execute(
            `SELECT * FROM transport_services ${isAdmin ? '' : 'WHERE is_available = TRUE'} ORDER BY id DESC`
        );

        res.json({ services: rows });
    } catch (error) {
        console.error("getAllTransportServices error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. جلب خدمة محددة (GET)
export const getTransportServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await getTransportServiceDetails(id);

        if (!service) {
            return res.status(404).json({ message: "خدمة النقل غير موجودة." });
        }
        
        const isAdmin = checkAdminAuth(req); 
        if (!isAdmin && !service.is_available) {
             return res.status(404).json({ message: "خدمة النقل غير متاحة حالياً." });
        }
        
        res.json({ service });
    } catch (error) {
        console.error("getTransportServiceById error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 4. تحديث خدمة نقل (PUT/PATCH)
export const updateTransportService = async (req, res) => {
    if (!checkAdminAuth(req)) {
        return res.status(403).json({ message: "مطلوب صلاحيات مسؤول (Admin) لإجراء هذه العملية." });
    }

    let uploadedImagePath = null;
    try {
        const { id } = req.params;
        
        let updates = req.body || {}; 
        
        if (typeof updates !== 'object' || updates === null || Array.isArray(updates)) {
             updates = {}; 
        }
        
        const service = await getTransportServiceDetails(id);
        if (!service) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "خدمة النقل غير موجودة." });
        }
        
        const fields = [];
        const params = [];

        const updateableFields = [
            'service_type', 'name_en', 'name_ar', 'capacity', 'is_available', 'pricing_method', 'base_price', 'minimum_charge', 'notes'
        ];

        // معالجة الصورة المرفوعة
        if (req.file) {
            uploadedImagePath = `${UPLOADS_PUBLIC_PREFIX}/transport_services/${req.file.filename}`;
            updates.image_url = uploadedImagePath; 
        }
        
        // بناء استعلام التحديث
        for (const field of updateableFields) {
            if (Object.prototype.hasOwnProperty.call(updates, field)) { 
                fields.push(`${field} = ?`);
                params.push(updates[field]);
            }
        }
        
        if (Object.prototype.hasOwnProperty.call(updates, 'image_url')) {
             fields.push(`image_url = ?`);
             params.push(updates.image_url);
        }

        if (fields.length === 0) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "لم يتم تقديم حقول صالحة للتحديث." });
        }

        // حذف الصورة القديمة إذا تم رفع صورة جديدة
        if (uploadedImagePath && service.image_url) {
            try {
                const oldImagePath = path.join(process.cwd(), "src", service.image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            } catch (cleanupError) {
                console.warn("Could not delete old image:", cleanupError.message);
            }
        }

        params.push(id);
        const sql = `UPDATE transport_services SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        
        await db.execute(sql, params);

        const updatedService = await getTransportServiceDetails(id);
        res.json({ message: "تم تحديث الخدمة بنجاح.", service: updatedService });

    } catch (error) {
        console.error("updateTransportService error:", error);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
    }
};

// 5. حذف خدمة نقل (DELETE)
export const deleteTransportService = async (req, res) => {
    if (!checkAdminAuth(req)) {
        return res.status(403).json({ message: "مطلوب صلاحيات مسؤول (Admin) لإجراء هذه العملية." });
    }
    
    try {
        const { id } = req.params;
        const service = await getTransportServiceDetails(id);

        if (!service) {
            return res.status(404).json({ message: "خدمة النقل غير موجودة." });
        }
        
        const [result] = await db.execute("DELETE FROM transport_services WHERE id = ?", [id]);

        if (result.affectedRows > 0 && service.image_url) {
             try {
                const imagePath = path.join(process.cwd(), "src", service.image_url);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (cleanupError) {
                 console.warn("Could not delete image on deletion:", cleanupError.message);
            }
        }

        res.json({ message: "تم حذف خدمة النقل بنجاح." });
    } catch (error) {
        console.error("deleteTransportService error:", error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(409).json({ message: "لا يمكن حذف الخدمة، لأن هناك حجوزات مرتبطة بها. يجب حذف الحجوزات أولاً." });
        }
        res.status(500).json({ error: error.message });
    }
};


// ----------------- Public Services -----------------

// 6. ⭐️ الدالة الرئيسية: حساب سعر التوصيل بناءً على المسافة المُدخلة (للعرض قبل الحجز)
export const calculateTransferPrice = async (req, res) => {
    try {
        const { distance_km } = req.query; 
        const distance = Number(distance_km);
        
        if (!Number.isFinite(distance) || distance <= 0) {
            return res.status(400).json({ message: "الرجاء توفير مسافة صالحة (distance_km)." });
        }

        const [rows] = await db.execute(
            `SELECT id, name_en, name_ar, capacity, base_price, minimum_charge, image_url 
             FROM transport_services 
             WHERE service_type = 'Transfer' AND pricing_method = 'Per_KM' AND is_available = TRUE
             ORDER BY base_price ASC`
        );
        
        const servicesWithCalculations = rows.map(service => {
            const basePrice = parseFloat(service.base_price || 0);
            const minimumCharge = parseFloat(service.minimum_charge || 0);

            // ⭐️ منطق التسعير (الضرب وتطبيق الحد الأدنى)
            let calculatedPrice = basePrice * distance;
            let finalPrice = Math.max(calculatedPrice, minimumCharge);
            
            return {
                id: service.id,
                name_en: service.name_en,
                name_ar: service.name_ar,
                capacity: service.capacity,
                image_url: service.image_url,
                distance_requested_km: distance.toFixed(2),
                base_price_per_km: basePrice.toFixed(2),
                minimum_charge: minimumCharge.toFixed(2),
                final_price: finalPrice.toFixed(2), 
            };
        });

        res.json({ 
            message: `تم حساب الأسعار لخدمات التوصيل لمسافة ${distance.toFixed(2)} كم.`,
            distance_km: distance.toFixed(2),
            services: servicesWithCalculations 
        });
    } catch (error) {
        console.error("calculateTransferPrice error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 7. جلب خدمات التوصيل الجاهزة للمستخدم (Public Transfer Services) - للعرض الأولي
export const getAvailableTransferServices = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT id, name_en, name_ar, capacity, base_price, image_url, minimum_charge 
             FROM transport_services 
             WHERE service_type = 'Transfer' AND pricing_method = 'Per_KM' AND is_available = TRUE
             ORDER BY capacity ASC`
        );
        
        // حساب سعر تقديري لمسافة ثابتة (مثلاً 20 كم) للعرض الأولي
        const ESTIMATED_DISTANCE = 20; 
        
        const servicesWithCalculations = rows.map(service => {
            const basePrice = parseFloat(service.base_price || 0);
            const minimumCharge = parseFloat(service.minimum_charge || 0);

            let calculatedPrice = basePrice * ESTIMATED_DISTANCE;
            let finalPrice = Math.max(calculatedPrice, minimumCharge);
            
            const estimatedPriceFor20Km = finalPrice.toFixed(2);
            
            return {
                ...service,
                estimated_distance_km: ESTIMATED_DISTANCE,
                estimated_price_20km: estimatedPriceFor20Km,
            };
        });

        res.json({ services: servicesWithCalculations });
    } catch (error) {
        console.error("getAvailableTransferServices error:", error);
        res.status(500).json({ error: error.message });
    }
};