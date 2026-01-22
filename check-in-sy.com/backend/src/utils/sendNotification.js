import admin from "./firebase.js";
import pool from "../config/db.js";

export async function sendNotificationToUser(userId, title, body) {
  try {
    const [rows] = await pool.query(
      "SELECT fcm_token FROM user_device_tokens WHERE user_id = ?",
      [userId]
    );

    if (!rows.length) return;

    const tokens = rows.map((t) => t.fcm_token);

    const message = {
      notification: { title, body },
      tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log("Sent:", response);

  } catch (err) {
    console.log("Notification error:", err);
  }
}
