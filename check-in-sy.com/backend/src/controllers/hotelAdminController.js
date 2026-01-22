// controllers/hotelAdminController.js
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import fs from "fs";
import path from "path";

const UPLOADS_ROOT = path.join(process.cwd(), "uploads");

const createStorage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(UPLOADS_ROOT, folder);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  });
export const loginHotel = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND role = 'hotel'",
      [email]
    );
    const user = users[0];
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    if (user.password !== password)
      return res.status(400).json({ message: "كلمة المرور غير صحيحة" });

    const [hotels] = await pool.query("SELECT * FROM hotls WHERE owner_id = ?", [user.id]);
    const hotel = hotels[0];
    if (!hotel) return res.status(404).json({ message: "هذا المستخدم ليس مرتبطاً بأي فندق" });

    const token = jwt.sign({ id: user.id, role: user.role, hotelId: hotel.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
      hotel,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "حدث خطأ في السيرفر", error: err.message });
  }
};

export const getHotelForDashboard = async (req, res) => {
  try {
    const hotelId = req.hotelId;

    const [hotelRows] = await pool.query("SELECT * FROM hotls WHERE id = ?", [hotelId]);
    if (!hotelRows.length) return res.status(404).json({ message: "الفندق غير موجود" });
    const hotel = hotelRows[0];

    const [rooms] = await pool.query(
      `SELECT r.*,
        (SELECT image_url FROM room_images WHERE room_id = r.id AND is_main = 1 LIMIT 1) AS main_image
       FROM rooms r WHERE r.hotel_id = ?`,
      [hotelId]
    );
    for (const room of rooms) {
      const [images] = await pool.query("SELECT id, image_url, is_main FROM room_images WHERE room_id = ?", [room.id]);
      const [services] = await pool.query("SELECT id, service_name, is_free, price FROM room_services WHERE room_id = ?", [room.id]);
      room.images = images;
      room.services = services;
    }

    const [amenities] = await pool.query("SELECT id, hotel_id, name, is_free, description, created_at FROM hotel_amenities WHERE hotel_id = ?", [hotelId]);

    const [additionalServices] = await pool.query(
      "SELECT id, hotel_id, name, description, price, available, created_at, updated_at FROM hotel_additional_services WHERE hotel_id = ?",
      [hotelId]
    );

    const [offers] = await pool.query(
      "SELECT id, hotel_id, title, description, price, notes, image_url, created_at, updated_at FROM hotel_offers WHERE hotel_id = ?",
      [hotelId]
    );

    return res.json({ hotel, rooms, amenities, additionalServices, offers });
  } catch (err) {
    console.error("getHotelForDashboard error:", err);
    return res.status(500).json({ message: "حدث خطأ في السيرفر", error: err.message });
  }
};

export const updateHotelByAdmin = async (req, res) => {
  try {
    const hotelId = req.hotelId;

    // قائمة الحقول المسموح تحديثها
    const allowed = [
      "name", "description", "city", "address", "stars",
      "phone", "email", "latitude", "longitude", "min_price",
      "max_price", "status"
    ];

    const fields = [];
    const params = [];

    // نضيف كل حقل إذا تم إرساله (ليس undefined) و ليس سلسلة فارغة
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) {
        const v = req.body[k];
        // اترك الحقول التي تم إرسالها كـ "" أو null إن أردت، لكن هنا نتجنب(undefined)
        fields.push(`${k} = ?`);
        params.push(v === "" ? null : v);
      }
    }

    // صورة رئيسية جديدة (middleware multer يضع الملف في req.file)
    if (req.file) {
      const uploadedPath = `/uploads/hotels/${req.file.filename}`;
      fields.push("main_image = ?");
      params.push(uploadedPath);

      // حذف القديمة إن كانت موجودة
      const [old] = await pool.query("SELECT main_image FROM hotls WHERE id = ?", [hotelId]);
      const oldImage = old[0]?.main_image;
      if (oldImage) deleteFileIfExists(oldImage);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "لا يوجد حقول لتحديثها" });
    }

    const sql = `UPDATE hotls SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`;
    params.push(hotelId);

    await pool.query(sql, params);

    return res.json({ message: "✅ تم تحديث بيانات الفندق بنجاح" });
  } catch (err) {
    console.error("updateHotelByAdmin error:", err);
    return res.status(500).json({ message: "حدث خطأ في السيرفر", error: err.message });
  }
};

/* Amenities */
export const addAmenity = async (req, res) => {
  try {
    const hotelId = req.hotelId;
    const { name, is_free = 1, description = null } = req.body;
    if (!name) return res.status(400).json({ message: "الاسم مطلوب" });

    const [result] = await pool.query(
      `INSERT INTO hotel_amenities (hotel_id, name, is_free, description, created_at) VALUES (?, ?, ?, ?, NOW())`,
      [hotelId, name, is_free ? 1 : 0, description]
    );

    return res.status(201).json({ message: "Amenity added", id: result.insertId });
  } catch (err) {
    console.error("addAmenity error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const editAmenity = async (req, res) => {
  try {
    const amenityId = req.params.id;
    const { name, is_free, description } = req.body;
    const [result] = await pool.query(
      "UPDATE hotel_amenities SET name = ?, is_free = ?, description = ? WHERE id = ?",
      [name, is_free ? 1 : 0, description || null, amenityId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Amenity not found" });
    return res.json({ message: "Amenity updated" });
  } catch (err) {
    console.error("editAmenity error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeAmenity = async (req, res) => {
  try {
    const amenityId = req.params.id;
    const [result] = await pool.query("DELETE FROM hotel_amenities WHERE id = ?", [amenityId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Amenity not found" });
    return res.json({ message: "Amenity deleted" });
  } catch (err) {
    console.error("removeAmenity error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAmenitiesByHotel = async (req, res) => {
  try {
    const hotelId = req.params.hotelId || req.hotelId;
    const [rows] = await pool.query("SELECT id, hotel_id, name, is_free, description, created_at FROM hotel_amenities WHERE hotel_id = ?", [hotelId]);
    return res.json(rows);
  } catch (err) {
    console.error("getAmenitiesByHotel error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* Additional services */
export const createAdditionalService = async (req, res) => {
  try {
    const hotelId = req.hotelId;
    const { name, description = null, price = 0, available = 1 } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const [result] = await pool.query(
      `INSERT INTO hotel_additional_services (hotel_id, name, description, price, available, created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
      [hotelId, name, description, price, available ? 1 : 0]
    );

    return res.status(201).json({ message: "Additional service created", id: result.insertId });
  } catch (err) {
    console.error("createAdditionalService error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateAdditionalService = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, available } = req.body;
    const [result] = await pool.query(
      `UPDATE hotel_additional_services SET name=?, description=?, price=?, available=?, updated_at=NOW() WHERE id=?`,
      [name, description, price, available ? 1 : 0, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Service not found" });
    return res.json({ message: "Additional service updated" });
  } catch (err) {
    console.error("updateAdditionalService error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteAdditionalService = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await pool.query("DELETE FROM hotel_additional_services WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Service not found" });
    return res.json({ message: "Additional service deleted" });
  } catch (err) {
    console.error("deleteAdditionalService error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getHotelAdditionalServices = async (req, res) => {
  try {
    const hotelId = req.params.hotelId || req.hotelId;
    const [rows] = await pool.query(
      "SELECT id, hotel_id, name, description, price, available, created_at, updated_at FROM hotel_additional_services WHERE hotel_id = ?",
      [hotelId]
    );
    return res.json(rows);
  } catch (err) {
    console.error("getHotelAdditionalServices error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* File deletion helper */
export const deleteFileIfExists = (filePath) => {
  try {
    if (!filePath) return;
    const p = path.join(process.cwd(), filePath.replace(/^\//, ""));
    if (fs.existsSync(p)) fs.unlinkSync(p);
  } catch (err) {
    console.warn("deleteFileIfExists:", err);
  }
};

/* Offers */
export const addHotelOffer = async (req, res) => {
  try {
    const hotelId = req.hotelId;
    const { title = null, description = null, price = null, notes = null, image_url = null } = req.body;
    const uploadedImage = req.file ? `/uploads/offers/${req.file.filename}` : image_url || null;

    const [result] = await pool.query(
      `INSERT INTO hotel_offers (hotel_id, title, description, price, notes, image_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [hotelId, title, description, price, notes, uploadedImage]
    );

    return res.status(201).json({ message: "Offer added", id: result.insertId });
  } catch (err) {
    console.error("addHotelOffer error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateHotelOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const { title = null, description = null, price = null, notes = null, image_url = null } = req.body;
    const uploadedImage = req.file ? `/uploads/offers/${req.file.filename}` : image_url || null;

    const [old] = await pool.query("SELECT image_url FROM hotel_offers WHERE id = ?", [offerId]);
    const oldImage = old[0]?.image_url;

    const [result] = await pool.query(
      `UPDATE hotel_offers SET title=?, description=?, price=?, notes=?, image_url=?, updated_at=NOW() WHERE id = ?`,
      [title, description, price, notes, uploadedImage, offerId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Offer not found" });

    if (req.file && oldImage) deleteFileIfExists(oldImage);

    return res.json({ message: "Offer updated" });
  } catch (err) {
    console.error("updateHotelOffer error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteHotelOffer = async (req, res) => {
  try {
    const offerId = req.params.id;

    const [old] = await pool.query("SELECT image_url FROM hotel_offers WHERE id = ?", [offerId]);
    const oldImage = old[0]?.image_url;
    if (oldImage) deleteFileIfExists(oldImage);

    const [result] = await pool.query("DELETE FROM hotel_offers WHERE id = ?", [offerId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Offer not found" });

    return res.json({ message: "Offer deleted" });
  } catch (err) {
    console.error("deleteHotelOffer error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getHotelOffers = async (req, res) => {
  try {
    const hotelId = req.params.hotelId || req.hotelId;
    const [rows] = await pool.query("SELECT id, hotel_id, title, description, price, notes, image_url, created_at, updated_at FROM hotel_offers WHERE hotel_id = ?", [hotelId]);
    return res.json(rows);
  } catch (err) {
    console.error("getHotelOffers error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* Rooms */
export const getHotelRooms = async (req, res) => {
  try {
    const hotelId = req.hotelId;
    const [rooms] = await pool.query(
      `SELECT r.*, 
        (SELECT image_url FROM room_images WHERE room_id = r.id AND is_main = 1 LIMIT 1) AS main_image
      FROM rooms r WHERE r.hotel_id = ?`,
      [hotelId]
    );
    return res.json(rooms);
  } catch (err) {
    console.error("getHotelRooms error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const hotelId = req.hotelId;
    const { name, description = null, price_per_night = 0, capacity = 1, available = 1 } = req.body || {};
    if (!name) return res.status(400).json({ message: "اسم الغرفة مطلوب" });

    const [result] = await pool.query(
      `INSERT INTO rooms (hotel_id, name, description, price_per_night, capacity, available, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [hotelId, name, description, price_per_night, capacity, available ? 1 : 0]
    );

    const roomId = result.insertId;

  // داخل createRoom
if (req.files && Array.isArray(req.files) && req.files.length > 0) {
  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    const uploadedImage = `/uploads/rooms/${file.filename}`;
    const isMain = i === 0 ? 1 : 0;
    await pool.query("INSERT INTO room_images (room_id, image_url, is_main) VALUES (?, ?, ?)", [roomId, uploadedImage, isMain]);
  }
} else if (req.file) {
  // fallback single file
  const uploadedImage = `/uploads/rooms/${req.file.filename}`;
  await pool.query("INSERT INTO room_images (room_id, image_url, is_main) VALUES (?, ?, ?)", [roomId, uploadedImage, 1]);
}


    return res.status(201).json({ message: "Room created", id: roomId });
  } catch (err) {
    console.error("createRoom error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { name, description, price_per_night, capacity, available } = req.body;
    const [result] = await pool.query(
      `UPDATE rooms SET name=?, description=?, price_per_night=?, capacity=?, available=?, updated_at=NOW() WHERE id=?`,
      [name, description, price_per_night, capacity, available ? 1 : 0, roomId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Room not found" });
    return res.json({ message: "Room updated" });
  } catch (err) {
    console.error("updateRoom error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    await pool.query("DELETE FROM room_images WHERE room_id = ?", [roomId]);
    await pool.query("DELETE FROM room_services WHERE room_id = ?", [roomId]);

    const [result] = await pool.query("DELETE FROM rooms WHERE id = ?", [roomId]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Room not found" });
    return res.json({ message: "Room deleted" });
  } catch (err) {
    console.error("deleteRoom error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* Reviews */
export const getReviewsByHotel = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;

    if (!hotelId) return res.status(400).json({ message: "معرّف الفندق مطلوب" });

    const [reviews] = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
              u.full_name AS user_name, u.email AS user_email
       FROM hotel_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.hotel_id = ?
       ORDER BY r.created_at DESC`,
      [hotelId]
    );

    return res.json(reviews);
  } catch (err) {
    console.error("getReviewsByHotel error:", err);
    return res.status(500).json({ message: "حدث خطأ في السيرفر", error: err.message });
  }
};

/* Full hotel public (admin) */
export const getHotelFullById = async (req, res) => {
  try {
    const hotelId = req.params.id;
    if (!hotelId) return res.status(400).json({ message: "معرّف الفندق مطلوب" });

    // ⭐ جلب بيانات الفندق + صورة main_image مباشرة من جدول hotls
    const [hotelRows] = await pool.query(
      "SELECT id, name, description, city, address, stars, phone, email, main_image FROM hotls WHERE id = ?",
      [hotelId]
    );

    if (!hotelRows.length)
      return res.status(404).json({ message: "الفندق غير موجود" });

    const hotel = hotelRows[0];

    // ❌ لم نعد نستخدم جدول hotel_images
    const images = hotel.main_image
      ? [{ id: 1, image_url: hotel.main_image, is_main: 1 }]
      : [];

    // ⭐ الغرف
    const [rooms] = await pool.query(
      `SELECT r.*,
              (SELECT image_url FROM room_images WHERE room_id = r.id AND is_main = 1 LIMIT 1) AS main_image
       FROM rooms r
       WHERE r.hotel_id = ?`,
      [hotelId]
    );

    // جلب الصور والخدمات لكل غرفة
    for (const room of rooms) {
      const [roomImages] = await pool.query(
        "SELECT id, image_url, is_main FROM room_images WHERE room_id = ?",
        [room.id]
      );

      const [roomServices] = await pool.query(
        "SELECT id, service_name, is_free, price FROM room_services WHERE room_id = ?",
        [room.id]
      );

      room.images = roomImages;
      room.services = roomServices;
    }

    // ⭐ الخدمات المجانية والمدفوعة
    const [amenities] = await pool.query(
      "SELECT id, hotel_id, name, is_free, description FROM hotel_amenities WHERE hotel_id = ?",
      [hotelId]
    );

    const [additionalServices] = await pool.query(
      "SELECT id, hotel_id, name, description, price, available FROM hotel_additional_services WHERE hotel_id = ?",
      [hotelId]
    );

    // ⭐ العروض
    const [offers] = await pool.query(
      "SELECT id, hotel_id, title, description, price, notes, image_url, created_at, updated_at FROM hotel_offers WHERE hotel_id = ?",
      [hotelId]
    );

    // ⭐ التقييمات
    const [reviews] = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
              u.full_name AS user_name, u.email AS user_email
       FROM hotel_reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.hotel_id = ?
       ORDER BY r.created_at DESC`,
      [hotelId]
    );

    // ⭐ شكل الإرجاع النهائي
    return res.json({
      hotel,
      images, // ← هنا موجودة صورة الفندق الرئيسية من نفس جدول hotls
      rooms,
      amenities,
      additionalServices,
      offers,
      reviews,
    });
  } catch (err) {
    console.error("getHotelFullById error:", err);
    return res.status(500).json({ message: "حدث خطأ في السيرفر", error: err.message });
  }
};


/* Room images */
export const getRoomImages = async (req, res) => {
  try {
    const roomId = req.params.roomId;

    const [images] = await pool.query(
      "SELECT id, image_url, is_main FROM room_images WHERE room_id = ? ORDER BY is_main DESC, id ASC",
      [roomId]
    );

    const mainImage = images.find(img => img.is_main === 1) || null;

    return res.json({ main_image: mainImage, images });
  } catch (err) {
    console.error("getRoomImages error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addRoomImage = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const uploadedImage = req.file ? `/uploads/rooms/${req.file.filename}` : null;
    if (!uploadedImage) return res.status(400).json({ message: "الصورة مطلوبة" });

    const [result] = await pool.query(
      "INSERT INTO room_images (room_id, image_url, is_main) VALUES (?, ?, ?)",
      [roomId, uploadedImage, 0]
    );

    return res.status(201).json({ message: "تمت إضافة الصورة", id: result.insertId });
  } catch (err) {
    console.error("addRoomImage error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateRoomImage = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const { is_main } = req.body;

    // إذا جعلنا صورة رئيسية يجب أن نزيل العلم من بقية الصور لنفس الغرفة (تحسين إضافي)
    if (is_main) {
      // الحصول على room_id لهذه الصورة
      const [rows] = await pool.query("SELECT room_id FROM room_images WHERE id = ?", [imageId]);
      const roomId = rows[0]?.room_id;
      if (roomId) {
        await pool.query("UPDATE room_images SET is_main = 0 WHERE room_id = ?", [roomId]);
      }
    }

    const [result] = await pool.query("UPDATE room_images SET is_main=? WHERE id=?", [is_main ? 1 : 0, imageId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "الصورة غير موجودة" });

    return res.json({ message: "تم تحديث حالة الصورة" });
  } catch (err) {
    console.error("updateRoomImage error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteRoomImage = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const [rows] = await pool.query("SELECT image_url FROM room_images WHERE id = ?", [imageId]);
    if (!rows.length) return res.status(404).json({ message: "الصورة غير موجودة" });

    const imgPath = rows[0].image_url;
    deleteFileIfExists(imgPath);

    await pool.query("DELETE FROM room_images WHERE id = ?", [imageId]);
    return res.json({ message: "تم حذف الصورة" });
  } catch (err) {
    console.error("deleteRoomImage error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};  
// GET /api/admin/notifications
export const getAdminNotifications = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) return res.status(401).json({ error: "غير مصرح" });

    // جلب الإشعارات المرتبطة بهذا المستخدم عبر notification_reads
    const [rows] = await pool.execute(
      `SELECT n.id, n.title, n.body, n.type, n.created_at, nr.read_at,
              (nr.read_at IS NULL) AS is_unread
       FROM admin_notifications n
       JOIN notification_reads nr ON nr.notification_id = n.id
       WHERE nr.user_id = ?
       ORDER BY n.created_at DESC
       LIMIT 200`,
      [currentUserId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("Error fetching admin notifications:", err.message);
    return res.status(500).json({ error: "Failed to load admin notifications" });
  }
};


// في ملف HotelAdminController.js أو ما شابه

/**
 * Controller: جلب الإشعارات لمالك الفندق المعني
 @param {object} req - يحتوي على req.user.id
 */
export const getHotelNotifications = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      return res.status(401).json({ message: "غير مصرح." });
    }

    const [notifications] = await pool.execute(
      `SELECT 
          n.id, 
          n.title, 
          n.body, 
          n.type, 
          n.created_at, 
          nr.read_at,
          (nr.read_at IS NULL) AS is_unread
       FROM admin_notifications n
       JOIN notification_reads nr 
            ON nr.notification_id = n.id
       WHERE nr.user_id = ?
       AND n.type = 'room_booking'
       ORDER BY n.created_at DESC
       LIMIT 200`,
      [ownerId]
    );

    return res.json(notifications);
  } catch (err) {
    console.error("Error fetching hotel owner notifications:", err.message);
    return res.status(500).json({ error: "فشل تحميل إشعارات مالك الفندق" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) return res.status(401).json({ error: "غير مصرح" });

    const { notification_id } = req.body;
    if (!notification_id) return res.status(400).json({ error: "notification_id مطلوب" });

    const [result] = await pool.execute(
      `UPDATE notification_reads
       SET read_at = NOW()
       WHERE notification_id = ? AND user_id = ? AND read_at IS NULL`,
      [notification_id, currentUserId]
    );

    // احسب عدد الاشعارات الغير مقروءة المتبقية لهذا المستخدم
    const [cntRows] = await pool.execute(
      `SELECT COUNT(*) AS cnt FROM notification_reads WHERE user_id = ? AND read_at IS NULL`,
      [currentUserId]
    );

    const unread_count = cntRows[0]?.cnt ?? 0;

    // أرسل سوكيت لواجهة المستخدم لتحديث الـ badge (استخدم sendToRole أو وظيفة مناسبة)
    sendToRole(`user_${currentUserId}`, "unreadCount", { unread_count });

    return res.json({ success: true, unread_count });
  } catch (err) {
    console.error("markNotificationRead error:", err.message);
    return res.status(500).json({ error: "Failed to mark notification read" });
  }
};

