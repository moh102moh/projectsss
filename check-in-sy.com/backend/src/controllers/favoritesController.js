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

/* 🔹 إضافة فندق إلى المفضلة */
export const addFavorite = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { hotel_id } = req.body;

    if (!userId) return res.status(401).json({ message: "غير مصرح" });
    if (!hotel_id) return res.status(400).json({ message: "hotel_id مطلوب" });

    // جلب اسم الفندق
    const [hotelRows] = await pool.query("SELECT name FROM hotls WHERE id = ?", [hotel_id]);
    const hotelName = hotelRows[0]?.name ?? "الفندق";

    await pool.query(
      "INSERT IGNORE INTO favorites (user_id, hotel_id) VALUES (?, ?)",
      [userId, hotel_id]
    );

    // إرسال إشعار
    await sendNotification(
      userId,
      "تمت الإضافة إلى المفضلة",
      `تمت إضافة ${hotelName} إلى مفضلاتك.`
    );

    return res.json({ message: "تمت الإضافة إلى المفضلة" });
  } catch (err) {
    console.error("addFavorite error:", err);
    return res.status(500).json({ message: "خطأ في الخادم", error: err.message });
  }
};

/* 🔹 إزالة فندق من المفضلة */
export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { hotel_id } = req.params;

    if (!userId) return res.status(401).json({ message: "غير مصرح" });

    await pool.query("DELETE FROM favorites WHERE user_id = ? AND hotel_id = ?", [userId, hotel_id]);
    return res.json({ message: "تمت الإزالة من المفضلة" });
  } catch (err) {
    console.error("removeFavorite error:", err);
    return res.status(500).json({ message: "خطأ في الخادم", error: err.message });
  }
};

/* 🔹 جلب مفضلات المستخدم */
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "غير مصرح" });

    const [rows] = await pool.query(
      `SELECT h.* 
       FROM hotls h
       JOIN favorites f ON f.hotel_id = h.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("getUserFavorites error:", err);
    return res.status(500).json({ message: "خطأ في الخادم", error: err.message });
  }
};
