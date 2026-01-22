// controllers/hotelController.js

import pool from "../config/db.js";
import fs from "fs";
import path from "path";

const UPLOADS_PUBLIC_PREFIX = "/uploads";
const UPLOADS_FS_ROOT = path.join(process.cwd(), "src", "uploads");

/* ---------------------------------------------------
   🧹 حذف ملف إذا كان موجود
--------------------------------------------------- */
const deleteFileIfExists = (publicPath) => {
  try {
    if (!publicPath) return;
    const rel = publicPath.replace(/^\//, "");
    const full = path.join(process.cwd(), "src", rel);
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (err) {
    console.warn("deleteFileIfExists error:", err);
  }
};

/* ---------------------------------------------------
   🏨 إنشاء فندق جديد
--------------------------------------------------- */
export const createHotel = async (req, res) => {
  try {
    console.log("createHotel body:", req.body);
    console.log("createHotel files:", req.files);

    const {
      name,
      description,
      city,
      address,
      stars,
      phone,
      email,
      latitude,
      longitude,
      owner_id,
      created_by,
      min_price,
      max_price,
      status,
      amenities,
      image_paths,
    } = req.body;

    if (!name || !city || !address || !stars || !owner_id || min_price == null || max_price == null) {
      return res.status(400).json({ message: "يرجى إدخال جميع الحقول المطلوبة" });
    }

    // تحديد الصورة الرئيسية
    let main_image = null;
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      main_image = `${UPLOADS_PUBLIC_PREFIX}/hotels/${req.files[0].filename}`;
    } else if (image_paths) {
      try {
        const parsed = typeof image_paths === "string" ? JSON.parse(image_paths) : image_paths;
        if (Array.isArray(parsed) && parsed.length > 0) main_image = parsed[0];
      } catch {
        main_image = null;
      }
    }

    const [result] = await pool.query(
      `INSERT INTO hotls 
        (name, description, city, address, stars, phone, email, main_image, latitude, longitude, owner_id, created_by, status, min_price, max_price, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        name,
        description || null,
        city,
        address,
        stars,
        phone || null,
        email || null,
        main_image,
        latitude || null,
        longitude || null,
        owner_id,
        created_by || 1,
        status || "نشط",
        min_price,
        max_price,
      ]
    );

    const hotelId = result.insertId;

    // إضافة المرافق إن وجدت
    await insertAmenities(hotelId, amenities);

    return res.status(201).json({
      message: "تم إنشاء الفندق بنجاح",
      hotel_id: hotelId,
      main_image,
    });
  } catch (err) {
    console.error("createHotel error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ---------------------------------------------------
   ✏️ تعديل فندق
--------------------------------------------------- */
export const updateHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    console.log("updateHotel body:", req.body);
    console.log("updateHotel files:", req.files);

    const {
      name,
      description,
      city,
      address,
      stars,
      phone,
      email,
      latitude,
      longitude,
      owner_id,
      min_price,
      max_price,
      amenities,
      image_paths,
      status,
    } = req.body;

    // جلب الصورة القديمة لحذفها لاحقًا إذا تم رفع جديدة
    const [oldRows] = await pool.query("SELECT main_image FROM hotls WHERE id = ?", [hotelId]);
    const oldMain = oldRows[0]?.main_image || null;

    // تحديد الصورة الجديدة
    let main_image = oldMain;
    if (req.files && req.files.length > 0) {
      main_image = `${UPLOADS_PUBLIC_PREFIX}/hotels/${req.files[0].filename}`;
      if (oldMain && oldMain.startsWith(UPLOADS_PUBLIC_PREFIX)) deleteFileIfExists(oldMain);
    } else if (image_paths) {
      try {
        const parsed = typeof image_paths === "string" ? JSON.parse(image_paths) : image_paths;
        if (Array.isArray(parsed) && parsed.length > 0) main_image = parsed[0];
      } catch {
        // ignore
      }
    }

    // بناء استعلام التحديث
    const fields = [];
    const params = [];
    const pushIf = (key, val) => {
      if (val !== undefined) {
        fields.push(`${key} = ?`);
        params.push(val === "" ? null : val);
      }
    };

    pushIf("name", name);
    pushIf("description", description);
    pushIf("city", city);
    pushIf("address", address);
    pushIf("stars", stars);
    pushIf("phone", phone);
    pushIf("email", email);
    pushIf("latitude", latitude);
    pushIf("longitude", longitude);
    pushIf("owner_id", owner_id);
    pushIf("min_price", min_price);
    pushIf("max_price", max_price);
    pushIf("status", status);
    pushIf("main_image", main_image);

    if (fields.length > 0) {
      const sql = `UPDATE hotls SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`;
      params.push(hotelId);
      await pool.query(sql, params);
    }

    // تحديث المرافق إن أُرسلت
    if (amenities) {
      let parsedAmenities = [];
      try {
        parsedAmenities = typeof amenities === "string" ? JSON.parse(amenities) : amenities;
      } catch {
        parsedAmenities = [];
      }
      await updateHotelAmenitiesSmart(hotelId, parsedAmenities);
    }

    return res.json({ message: "تم تحديث الفندق بنجاح" });
  } catch (err) {
    console.error("updateHotel error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ---------------------------------------------------
   ❌ حذف فندق (يحذف الصورة من المجلد)
--------------------------------------------------- */
export const deleteHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const [rows] = await pool.query("SELECT main_image FROM hotls WHERE id = ?", [hotelId]);
    const hotel = rows[0];
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    if (hotel.main_image && hotel.main_image.startsWith(UPLOADS_PUBLIC_PREFIX)) {
      deleteFileIfExists(hotel.main_image);
    }

    await pool.query("DELETE FROM hotel_amenities WHERE hotel_id = ?", [hotelId]);
    await pool.query("DELETE FROM hotel_additional_services WHERE hotel_id = ?", [hotelId]);
    await pool.query("DELETE FROM hotls WHERE id = ?", [hotelId]);

    return res.json({ message: "Hotel deleted successfully" });
  } catch (err) {
    console.error("deleteHotel error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ---------------------------------------------------
   📋 جلب جميع الفنادق
--------------------------------------------------- */
export const getAllHotels = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    let query;

    if (userId) {
      query = `
        SELECT h.*, 
          CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END AS is_favorite
        FROM hotls h
        LEFT JOIN favorites f ON f.hotel_id = h.id AND f.user_id = ?
        ORDER BY is_favorite DESC, h.id DESC
      `;
      const [rows] = await pool.query(query, [userId]);
      return res.json(rows);
    } else {
      const [rows] = await pool.query("SELECT * FROM hotls ORDER BY id DESC");
      return res.json(rows);
    }
  } catch (err) {
    console.error("getAllHotels error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ---------------------------------------------------
   🔍 جلب فندق حسب ID
--------------------------------------------------- */
export const getHotelById = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const [hotelRows] = await pool.query("SELECT * FROM hotls WHERE id = ?", [hotelId]);
    const hotel = hotelRows[0];
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const [amenities] = await pool.query(
      "SELECT id, name, is_free, description FROM hotel_amenities WHERE hotel_id = ?",
      [hotelId]
    );

    const [hotelServices] = await pool.query(
      "SELECT id, name, description, price, available FROM hotel_additional_services WHERE hotel_id = ?",
      [hotelId]
    );

    return res.json({
      hotel,
      amenities,
      hotelServices,
    });
  } catch (err) {
    console.error("getHotelById error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ---------------------------------------------------
   🔎 بحث عن الفنادق
--------------------------------------------------- */
export const searchHotels = async (req, res) => {
  try {
    const { name, city, address, stars, min_price, max_price } = req.query;

    let query = `SELECT * FROM hotls WHERE status = 'approved'`;
    const params = [];

    if (name) {
      query += " AND name LIKE ?";
      params.push(`%${name}%`);
    }
    if (city) {
      query += " AND city LIKE ?";
      params.push(`%${city}%`);
    }
    if (address) {
      query += " AND address LIKE ?";
      params.push(`%${address}%`);
    }
    if (stars) {
      query += " AND stars = ?";
      params.push(stars);
    }
    if (min_price) {
      query += " AND min_price >= ?";
      params.push(min_price);
    }
    if (max_price) {
      query += " AND max_price <= ?";
      params.push(max_price);
    }

    query += " ORDER BY id DESC";

    const [rows] = await pool.query(query, params);

    return res.json({
      total: rows.length,
      results: rows,
    });
  } catch (err) {
    console.error("searchHotels error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/* ---------------------------------------------------
   🧩 المرافق (amenities) CRUD
--------------------------------------------------- */
export const addAmenity = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const { name, is_free = 1, description = null } = req.body;
    if (!name) return res.status(400).json({ message: "name required" });
    const [result] = await pool.query(
      "INSERT INTO hotel_amenities (hotel_id, name, is_free, description, created_at) VALUES (?, ?, ?, ?, NOW())",
      [hotelId, name, is_free ? 1 : 0, description]
    );
    return res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("addAmenity error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateAmenity = async (req, res) => {
  try {
    const id = req.params.amenityId;
    const { name, is_free, description } = req.body;
    const [result] = await pool.query(
      "UPDATE hotel_amenities SET name=?, is_free=?, description=? WHERE id=?",
      [name, is_free ? 1 : 0, description || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "not found" });
    return res.json({ message: "updated" });
  } catch (err) {
    console.error("updateAmenity error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteAmenity = async (req, res) => {
  try {
    const id = req.params.amenityId;
    await pool.query("DELETE FROM hotel_amenities WHERE id = ?", [id]);
    return res.json({ message: "deleted" });
  } catch (err) {
    console.error("deleteAmenity error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAmenitiesByHotel = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const [rows] = await pool.query(
      "SELECT id, name, is_free, description FROM hotel_amenities WHERE hotel_id = ?",
      [hotelId]
    );
    return res.json(rows);
  } catch (err) {
    console.error("getAmenitiesByHotel error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ---------------------------------------------------
   💡 العروض (offers) CRUD
--------------------------------------------------- */
export const addHotelOffer = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const { title, description, price, notes, image_url } = req.body;
    const uploadedImage = req.file
      ? `${UPLOADS_PUBLIC_PREFIX}/offers/${req.file.filename}`
      : image_url || null;

    const [result] = await pool.query(
      "INSERT INTO hotel_offers (hotel_id, title, description, price, notes, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [hotelId, title || null, description || null, price || null, notes || null, uploadedImage]
    );
    return res.status(201).json({ offerId: result.insertId });
  } catch (err) {
    console.error("addHotelOffer error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateHotelOffer = async (req, res) => {
  try {
    const offerId = req.params.offerId;
    const { title, description, price, notes, image_url } = req.body;
    const uploadedImage = req.file
      ? `${UPLOADS_PUBLIC_PREFIX}/offers/${req.file.filename}`
      : image_url || null;

    const [old] = await pool.query("SELECT image_url FROM hotel_offers WHERE id = ?", [offerId]);
    const oldImage = old[0]?.image_url;
    const [result] = await pool.query(
      "UPDATE hotel_offers SET title=?, description=?, price=?, notes=?, image_url=?, updated_at=NOW() WHERE id=?",
      [title || null, description || null, price || null, notes || null, uploadedImage, offerId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "not found" });
    if (req.file && oldImage && oldImage.startsWith(UPLOADS_PUBLIC_PREFIX))
      deleteFileIfExists(oldImage);

    return res.json({ message: "updated" });
  } catch (err) {
    console.error("updateHotelOffer error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteHotelOffer = async (req, res) => {
  try {
    const offerId = req.params.offerId;
    const [old] = await pool.query("SELECT image_url FROM hotel_offers WHERE id = ?", [offerId]);
    const oldImage = old[0]?.image_url;
    if (oldImage && oldImage.startsWith(UPLOADS_PUBLIC_PREFIX)) deleteFileIfExists(oldImage);
    await pool.query("DELETE FROM hotel_offers WHERE id = ?", [offerId]);
    return res.json({ message: "deleted" });
  } catch (err) {
    console.error("deleteHotelOffer error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getHotelOffers = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const [rows] = await pool.query(
      "SELECT id, title, description, price, notes, image_url, created_at, updated_at FROM hotel_offers WHERE hotel_id = ?",
      [hotelId]
    );
    return res.json(rows);
  } catch (err) {
    console.error("getHotelOffers error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ---------------------------------------------------
   ⚙️ دوال مساعدة
--------------------------------------------------- */
const insertAmenities = async (hotelId, amenities) => {
  if (!amenities) return;
  let arr = amenities;
  if (typeof amenities === "string") {
    try {
      arr = JSON.parse(amenities);
    } catch {
      arr = [];
    }
  }
  if (!Array.isArray(arr) || arr.length === 0) return;

  const placeholders = arr.map(() => "(?, ?, ?, ?)").join(",");
  const values = arr.flatMap((a) => [
    hotelId,
    a.name || "",
    a.is_free ? 1 : 0,
    a.description || null,
  ]);

  await pool.query(
    `INSERT INTO hotel_amenities (hotel_id, name, is_free, description) VALUES ${placeholders}`,
    values
  );
};

const updateHotelAmenitiesSmart = async (hotelId, amenities) => {
  if (!Array.isArray(amenities)) return;
  const [existing] = await pool.query("SELECT id FROM hotel_amenities WHERE hotel_id = ?", [hotelId]);
  const existingIds = existing.map((a) => a.id);
  const incomingIds = amenities.filter((a) => a.id).map((a) => a.id);

  const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
  if (toDelete.length > 0) {
    await pool.query(`DELETE FROM hotel_amenities WHERE id IN (${toDelete.join(",")})`);
  }

  for (const a of amenities) {
    if (a.id && existingIds.includes(a.id)) {
      await pool.query(
        "UPDATE hotel_amenities SET name=?, is_free=?, description=? WHERE id=?",
        [a.name, a.is_free ? 1 : 0, a.description || null, a.id]
      );
    } else {
      await pool.query(
        "INSERT INTO hotel_amenities (hotel_id, name, is_free, description) VALUES (?, ?, ?, ?)",
        [hotelId, a.name, a.is_free ? 1 : 0, a.description || null]
      );
    }
  }
};
