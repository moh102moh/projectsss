import db from "../config/db.js";
import axios from "axios";
import { getReadersForNotification } from "./notificationHelpers.js";

import { sendToRole } from "../socket/index.js";
import admin from "../utils/firebase.js"; // ⬅️ هام: تأكد من صحة هذا المسار واستيراد Firebase Admin
const googleApiKey = "AIzaSyD8_7SK48J-IQC0qpCwKVJwSnnog7NqUvE";
export async function sendNotification(userId, title, body) {
  try {
    // 1️⃣ حفظ الإشعار في قاعدة البيانات
    await db.execute(
      "INSERT INTO notifications (user_id, title, body) VALUES (?, ?, ?)",
      [userId, title, body]
    );

    // 2️⃣ جلب توكنات الأجهزة
    const [tokens] = await db.execute(
      "SELECT fcm_token FROM user_device_tokens WHERE user_id = ?",
      [userId]
    );

    if (!tokens.length) return;

    // 3️⃣ إرسال الإشعارات عبر Firebase
    const messages = tokens.map(t => ({
      token: t.fcm_token,
      notification: { title, body },
    }));

    await Promise.all(
      messages.map(msg =>
        admin.messaging().send(msg).catch(err => {
          console.warn(`Failed to send notification to ${msg.token}:`, err.message);
        })
      )
    );
  } catch (err) {
    console.error("Notification Error:", err);
  }
}
export async function scheduleBookingNotification(bookingId, userId, title, body, scheduledTime) {
    try {
        // ���� ��� Date
        if (!(scheduledTime instanceof Date) || isNaN(scheduledTime)) {
            console.log("? scheduledTime is invalid:", scheduledTime);
            return;
        }

        // ����� �� MySQL
        const mysqlTime = scheduledTime.toISOString().slice(0, 19).replace("T", " ");

        console.log("?? Saving scheduled notification:", mysqlTime);

        await db.execute(
            `INSERT INTO scheduled_notifications
            (booking_id, user_id, title, body, scheduled_time, is_sent, created_at)
            VALUES (?, ?, ?, ?, ?, 0, NOW())`,
            [bookingId, userId, title, body, mysqlTime]
        );

        console.log("? Scheduled saved!");

    } catch (err) {
        console.error("Schedule Notification Error:", err);
    }
}

// -------------------- Google Distance --------------------
async function getDistanceFromGoogle(start, end) {
    try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(start)}&destinations=${encodeURIComponent(end)}&key=${googleApiKey}`;
        const res = await axios.get(url);

        if (res.data.status !== 'OK' || !res.data.rows[0].elements[0] || res.data.rows[0].elements[0].status !== 'OK') {
            console.warn("Google API error – fallback to 10 km");
            return 10; // fallback
        }

        return res.data.rows[0].elements[0].distance.value / 1000;
    } catch (err) {
        console.error("Google API failed – fallback:", err.message);
        return 10; // fallback
    }
}

// تخزين مؤقت لكل مستخدم
let tempBookingData = {};


// -------------------- STEP 1: حساب المسافة + عرض السيارات --------------------
const calculateAndListServices = async (req, res) => {
    try {
        const { start, end } = req.body;
        if (!start || !end)
            return res.status(400).json({ message: "يرجى إدخال نقطة البداية والنهاية" });

        const distanceKm = await getDistanceFromGoogle(start, end);

        // جلب السيارات + السائق
        const [services] = await db.execute(
            `SELECT 
                ts.*, 
                d.driver_name, d.driver_image, d.car_color, d.car_plate_number, d.car_model
            FROM transport_services ts
            LEFT JOIN drivers d ON ts.id = d.service_id
            WHERE ts.service_type = 'Transfer'
            AND ts.is_available = TRUE
            AND ts.pricing_method = 'Per_KM'`
        );

        const servicesWithPrice = services.map(s => {
            const basePrice = parseFloat(s.base_price);
            const minCharge = parseFloat(s.minimum_charge);
            const finalPrice = Math.max(basePrice * distanceKm, minCharge);

            return {
                id: s.id,
                name_ar: s.name_ar,
                capacity: s.capacity,
                image_url: s.image_url,
                calculated_distance_km: distanceKm,
                final_price: finalPrice.toFixed(2),

                driver: {
                    name: s.driver_name,
                    image: s.driver_image,
                    car_color: s.car_color,
                    car_plate_number: s.car_plate_number,
                    car_model: s.car_model
                }
            };
        });

        // حفظ start/end للمستخدم
        if (req.user?.id) {
            tempBookingData[req.user.id] = {
                start,
                end,
                distanceKm
            };
        }

        res.json({
            distance_km: distanceKm,
            services: servicesWithPrice
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


// -------------------- STEP 2: إنشاء الحجز --------------------
const createBookingDirect = async (req, res) => {
    let connection;
    try {
        const user_id = req.user?.id;
        if (!user_id)
            return res.status(401).json({ message: "غير مصرح." });

        const { service_id, guests_count = 1 } = req.body;
        if (!service_id)
            return res.status(400).json({ message: "الرجاء تحديد السيارة" });

        const tripData = tempBookingData[user_id];
        if (!tripData)
            return res.status(400).json({ message: "يجب إدخال start و end أولاً" });

        const { start, end, distanceKm } = tripData;

       // إذا المستخدم بعث وقت الرحلة نستخدمه، وإلا نستخدم الوقت الحالي
let trip_datetime = req.body.trip_datetime 
    ? new Date(req.body.trip_datetime)
    : new Date();

// نحفظ نسخة بصيغة MySQL
const trip_datetime_sql = trip_datetime.toISOString().slice(0, 19).replace('T', ' ');


        // جلب تفاصيل الخدمة للحساب
        const [svcRows] = await db.execute("SELECT * FROM transport_services WHERE id = ?", [service_id]);
        if (!svcRows[0]) return res.status(404).json({ message: "الخدمة غير موجودة" });

        const service = svcRows[0];
        const basePrice = parseFloat(service.base_price);
        const minCharge = parseFloat(service.minimum_charge);
        const lineTotal = Math.max(basePrice * distanceKm, minCharge);

        connection = await db.getConnection();
        await connection.beginTransaction();

        const today = new Date().toISOString().slice(0, 10);

        // إدخال حجز رئيسي
        const [ins] = await connection.execute(
            "INSERT INTO bookings (user_id, room_id, check_in, check_out, guests_count, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [user_id, null, today, today, guests_count, lineTotal, "pending"]
        );

        const bookingId = ins.insertId;

        // إدخال تفاصيل النقل
        await connection.execute(
            `INSERT INTO booking_transportation 
            (booking_id, service_id, pickup_location_name, dropoff_location_name, trip_datetime, calculated_distance_km, guests_count, line_total, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                bookingId,
                service_id,
                start,
                end,
                trip_datetime,
                distanceKm,
                guests_count,
                lineTotal,
                "pending"
            ]
        );

        await connection.commit();
      if (req.body.trip_datetime) {

    const notifyTime = new Date(trip_datetime.getTime() - 10 * 60 * 1000);

    await scheduleBookingNotification(
        bookingId,
        user_id,
        "🚗 تذكير بالرحلة بعد قليل",
        `رحلتك من ${start} إلى ${end} ستبدأ بعد 10 دقائق.`,
        notifyTime
    );
}

await sendNotification(
    user_id,
    "✅ تم تأكيد حجز النقل",
    `تم حجز رحلتك من ${start} إلى ${end} في ${trip_datetime_sql}. المجموع: ${lineTotal.toFixed(2)} ر.س`
);  sendToRole("delivery", "newDelivery", {
            bookingId,
            start,
            end,
            price: lineTotal,
            message: "?? New delivery request"
        });

        // --------------------------
        // �����: ����� ��� Admin
        // --------------------------
      // �����: ����� ��� Admin
sendToRole("admin", "newDelivery", {
  bookingId,
  start,
  end,
  price: lineTotal,
  message: "?? A new delivery booking has been registered"
});

// ��� ����� ������� �� ������ ������
// ��� ��� ������� ������� (�� createBookingDirect)
try {
  const title = "?? New delivery request";
  const body = `user ${user_id}Book a ride from ${start} to ${end} Total -: ${lineTotal.toFixed(2)}`;

  const [ins] = await connection.execute(
    "INSERT INTO admin_notifications (title, body, type, hotel_id, owner_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [title, body, "delivery", null, user_id, new Date()]
  );

  const notificationId = ins.insertId;

  // ��� ����� �������
  const readers = await getReadersForNotification({ type: "delivery", hotel_id: null });

  // ����� �� ������� ��� ����
  const insertPromises = readers.map(uid =>
    connection.execute(
      "INSERT INTO notification_reads (notification_id, user_id, read_at, created_at) VALUES (?, ?, NULL, ?)",
      [notificationId, uid, new Date()]
    )
  );

  await Promise.all(insertPromises);

  // ���� �����: ��� ���� ��� roles ��������
  sendToRole("admin", "newDelivery", {
    bookingId,
    start,
    end,
    price: lineTotal,
    message: title,
    notificationId
  });

  // (�������) ���� ����� ��� ���� ��� ��������� ����� ������ ��� �������
  for (const uid of readers) {
    const [[{ cnt }]] = await db.execute(
      `SELECT COUNT(*) as cnt FROM notification_reads WHERE user_id = ? AND read_at IS NULL`,
      [uid]
    );
    // ���� ��� user ������ (��� ���� ����� sendToUser)
    sendToRole(`user_${uid}`, "unreadCount", { unread_count: cnt });
  }

} catch (err) {
  console.warn("Failed to save admin notification for delivery:", err.message);
}


        res.json({
            message: "تم إنشاء الحجز بنجاح",
            booking_id: bookingId,
            total_price: lineTotal
        });
        

    } catch (err) {
        if (connection) connection.rollback();
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        connection?.release();
    }
};


// -------------------- عرض كل حجوزات المستخدم --------------------
const getUserTransportBookings = async (req, res) => {
    try {
        const user_id = req.user?.id;

        const [rows] = await db.execute(
            `SELECT 
                b.id AS booking_id,
                b.status AS booking_status,
                b.total_price,
                bt.service_id,
                ts.name_ar AS service_name,
                bt.pickup_location_name,
                bt.dropoff_location_name,
                bt.trip_datetime,
                bt.calculated_distance_km,
                bt.line_total,
                bt.status AS transport_status,

                d.driver_name,
                d.driver_image,
                d.car_color,
                d.car_plate_number,
                d.car_model

            FROM bookings b
            JOIN booking_transportation bt ON b.id = bt.booking_id
            JOIN transport_services ts ON bt.service_id = ts.id
            LEFT JOIN drivers d ON ts.id = d.service_id
            WHERE b.user_id = ?
            ORDER BY b.id DESC`,
            [user_id]
        );

        res.json({ bookings: rows });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// -------------------- عرض حجز واحد --------------------
const getSingleTransportBooking = async (req, res) => {
    try {
        const user_id = req.user?.id;
        const bookingId = req.params.booking_id;

        const [rows] = await db.execute(
            `SELECT 
                b.id AS booking_id,
                b.status AS booking_status,
                b.total_price,
                bt.service_id,
                ts.name_ar AS service_name,
                bt.pickup_location_name,
                bt.dropoff_location_name,
                bt.trip_datetime,
                bt.guests_count,
                bt.calculated_distance_km,
                bt.line_total,
                bt.status AS transport_status,

                d.driver_name,
                d.driver_image,
                d.car_color,
                d.car_plate_number,
                d.car_model

            FROM bookings b
            JOIN booking_transportation bt ON b.id = bt.booking_id
            JOIN transport_services ts ON bt.service_id = ts.id
            LEFT JOIN drivers d ON ts.id = d.service_id
            WHERE b.user_id = ? AND b.id = ?
            LIMIT 1`,
            [user_id, bookingId]
        );

        if (!rows.length)
            return res.status(404).json({ message: "الحجز غير موجود" });

        res.json({ booking: rows[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};





// -------------------- ✅ الدالة الجديدة لعرض كل حجوزات النقل للمدير --------------------
// transportationController.js (الدالة المعدلة)

// -------------------- ✅ الدالة الجديدة لعرض كل حجوزات النقل للمدير --------------------
// -------------------- ✅ الدالة الجديدة لعرض كل حجوزات النقل للمدير --------------------
const getAllTransportBookingsForAdmin = async (req, res) => {
    try {

        const [rows] = await db.execute(
            `SELECT 
                b.id AS booking_id,
                b.status AS booking_status,
                b.total_price,
                
                -- بيانات المستخدم
                u.full_name AS user_name,
                u.email AS user_email,
                u.phone AS user_phone,

                -- بيانات حجز النقل
                bt.service_id,
                ts.name_ar AS service_name,
                ts.image_url,
                bt.pickup_location_name,
                bt.dropoff_location_name,
                bt.trip_datetime,
                bt.calculated_distance_km,
                bt.guests_count,
                bt.line_total,
                bt.status AS transport_status,

                -- بيانات السائق
                d.driver_name,
                d.driver_image,
                d.car_color,
                d.car_plate_number,
                d.car_model

            FROM bookings b
            JOIN booking_transportation bt ON b.id = bt.booking_id
            JOIN transport_services ts ON bt.service_id = ts.id
            LEFT JOIN drivers d ON ts.id = d.service_id
            LEFT JOIN users u ON b.user_id = u.id

            ORDER BY b.id DESC`
        );

        res.json({ bookings: rows });

    } catch (err) {
        console.error("Error fetching admin transport bookings:", err);
        res.status(500).json({ error: err.message });
    }
};



export {
    calculateAndListServices,
    createBookingDirect,
    getUserTransportBookings,
    getSingleTransportBooking,
    // ✅ تصدير الدالة الجديدة
    getAllTransportBookingsForAdmin 
};