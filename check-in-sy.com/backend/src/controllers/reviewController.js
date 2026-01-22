import pool from "../config/db.js";
import admin from "../utils/firebase.js";

// دالة لإرسال إشعار وحفظه في جدول notifications
async function sendNotification(userId, title, body) {
  try {
    // حفظ الإشعار في قاعدة البيانات
    await pool.query(
      "INSERT INTO notifications (user_id, title, body) VALUES (?, ?, ?)",
      [userId, title, body]
    );

    const [tokens] = await pool.query(
      "SELECT fcm_token FROM user_device_tokens WHERE user_id = ?",
      [userId]
    );

    if (!tokens.length) return;

    const messages = tokens.map(t => ({
      token: t.fcm_token,
      notification: { title, body },
    }));

    await Promise.all(messages.map(msg => admin.messaging().send(msg)));
  } catch (err) {
    console.error("Notification Error:", err);
  }
}

export const addReview = async (req, res) => {
  try {
    const userId = req.body.user_id;
    const { hotel_id, rating, comment } = req.body;

    if (!hotel_id || !userId || !rating) {
      return res.status(400).json({ message: "الرجاء إدخال الفندق والمستخدم والتقييم." });
    }

    const [result] = await pool.query(
      `INSERT INTO hotel_reviews (hotel_id, user_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
      [hotel_id, userId, rating, comment || null]
    );

    // جلب اسم الفندق
    const [hotelRows] = await pool.query("SELECT name FROM hotls WHERE id = ?", [hotel_id]);
    const hotelName = hotelRows[0]?.name ?? "الفندق";

    // إرسال إشعار مع تخزينه
    await sendNotification(userId, "تم إضافة تقييم جديد", `تم إضافة تقييمك للفندق "${hotelName}" بنجاح.`);

    return res.status(201).json({ message: "تم إضافة التقييم بنجاح.", reviewId: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "حدث خطأ في السيرفر.", error: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    const [result] = await pool.query(
      `UPDATE hotel_reviews SET rating=?, comment=?, updated_at=NOW() WHERE id=?`,
      [rating, comment || null, reviewId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "التقييم غير موجود." });

    return res.json({ message: "تم تعديل التقييم بنجاح." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "حدث خطأ في السيرفر.", error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const [result] = await pool.query(`DELETE FROM hotel_reviews WHERE id=?`, [reviewId]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "التقييم غير موجود." });

    return res.json({ message: "تم حذف التقييم بنجاح." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "حدث خطأ في السيرفر.", error: err.message });
  }
};

export const getReviewsByHotel = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;

    const [rows] = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
              u.full_name
       FROM hotel_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.hotel_id=?
       ORDER BY r.created_at DESC`,
      [hotelId]
    );

    return res.json({ total: rows.length, reviews: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "حدث خطأ في السيرفر.", error: err.message });
  } 

  
};

export const getReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const [[row]] = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
              u.full_name
       FROM hotel_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.id=?`,
      [reviewId]
    );

    if (!row) return res.status(404).json({ message: "التقييم غير موجود." });

    return res.json(row);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "حدث خطأ في السيرفر.", error: err.message });
  }
};
