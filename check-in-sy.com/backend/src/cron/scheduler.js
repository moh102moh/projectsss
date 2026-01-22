import cron from "node-cron";
import db from "../config/db.js";
import admin from "../utils/firebase.js";

// إرسال إشعار وحفظه في جدول notifications
async function sendNotificationAndSave(userId, title, body) {
    try {
        await db.execute(
            "INSERT INTO notifications (user_id, title, body) VALUES (?, ?, ?)",
            [userId, title, body]
        );

        const [tokens] = await db.execute(
            "SELECT fcm_token FROM user_device_tokens WHERE user_id = ?",
            [userId]
        );

        if (!tokens.length) return;

        const messages = tokens.map(t => ({
            token: t.fcm_token,
            notification: { title, body }
        }));

        await Promise.all(messages.map(msg => admin.messaging().send(msg)));

        console.log(`������ Notification sent to user ${userId}`);

    } catch (err) {
        console.error("Cron Notification Send Error:", err);
    }
}

// فحص الإشعارات المجدولة وإرسالها
async function runScheduledNotifications() {
    try {
        const [rows] = await db.execute(
            `SELECT id, user_id, title, body 
             FROM scheduled_notifications
             WHERE is_sent = 0 AND scheduled_time <= NOW()`
        );

        if (rows.length === 0) {
            console.log("[Scheduler] No notifications due.");
            return;
        }

        console.log(`[Scheduler] Found ${rows.length} notifications to send.`);

        for (const n of rows) {
            await sendNotificationAndSave(n.user_id, n.title, n.body);
            await db.execute(
                "UPDATE scheduled_notifications SET is_sent = 1 WHERE id = ?",
                [n.id]
            );
        }

        console.log("✅ All scheduled notifications processed.");

    } catch (err) {
        console.error("runScheduledNotifications FAILED:", err);
    }
}

// تشغيل كرون
export const startScheduler = () => {
    cron.schedule("*/1 * * * *", runScheduledNotifications, {
        scheduled: true,
        timezone: "Asia/Riyadh",
    });

    console.log("✅ Scheduler started (every 1 minute).");
};
