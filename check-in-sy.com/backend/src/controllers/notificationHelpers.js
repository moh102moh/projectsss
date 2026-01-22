// notificationHelpers.js
import db from "../config/db.js";

/**
 * إرجاع قائمة المستخدمين (IDs) الذين يجب أن تصل لهم الإشعارات
 * حسب نوع الإشعار type
 * - admin → كل الإداريين
 * - delivery → السائقين والإداريين في قسم التوصيل
 * - room_booking → الإداري + صاحب الفندق الحقيقي owner_id
 */
export async function getReadersForNotification({ type, hotel_id, owner_id }) {
    try {
        let readers = [];

        // 1) ⛲ جميع الإداريين العامّين
        const [admins] = await db.execute(
            "SELECT id FROM users WHERE role = 'admin'"
        );
        readers.push(...admins.map(a => a.id));

        // 2) 🚚 إشعارات التوصيل
        if (type === "delivery") {
            const [deliveryUsers] = await db.execute(
                "SELECT id FROM users WHERE role IN ('delivery', 'delivery_admin')"
            );
            readers.push(...deliveryUsers.map(u => u.id));
        }

        // 3) 🏨 إشعارات الحجز الفندقي
        else if (type === "room_booking") {
            // صاحب الفندق الحقيقي (من جدول hotels.owner_id)
            if (owner_id) readers.push(owner_id);
        }

        // إزالة التكرارات
        readers = [...new Set(readers)];

        return readers;
    } catch (err) {
        console.error("getReadersForNotification Error:", err);
        return [];
    }
}
