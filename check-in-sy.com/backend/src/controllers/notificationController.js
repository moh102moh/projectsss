import pool from "../config/db.js"; 

export async function saveToken(req, res) {
  const { user_id, fcm_token } = req.body;

  if (!user_id || !fcm_token) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await pool.query(
      "INSERT INTO user_device_tokens (user_id, fcm_token) VALUES (?, ?)",
      [user_id, fcm_token]
    );

    res.json({ message: "Token saved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving token" });
  }
}
export const getUserTokens = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "غير مصرح" });

    const [rows] = await pool.query(
      "SELECT * FROM user_device_tokens WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    return res.json({ total: rows.length, tokens: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "حدث خطأ في الخادم", error: err.message });
  }
};

export const getAllTokens = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user_device_tokens ORDER BY created_at DESC");
    return res.json({ total: rows.length, tokens: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "حدث خطأ في الخادم", error: err.message });
  }
};
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "غير مصرح" });

    const [rows] = await pool.query(
      `SELECT id, title, body, created_at, is_read
       FROM notifications
       WHERE user_id=?
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.json({ total: rows.length, notifications: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "حدث خطأ في السيرفر.", error: err.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    const notificationId = req.params.id;

    if (!userId) return res.status(401).json({ message: "غير مصرح" });

    const [result] = await pool.query(
      "UPDATE notifications SET is_read = 1 WHERE id=? AND user_id=?",
      [notificationId, userId]
    );

    if (result.affectedRows === 0) 
      return res.status(404).json({ message: "الإشعار غير موجود أو ليس لك" });

    return res.json({ message: "تم تعليم الإشعار كمقروء." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "حدث خطأ في السيرفر.", error: err.message });
  }
};