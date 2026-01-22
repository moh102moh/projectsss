import db from "../config/db.js";
import admin from "../utils/firebase.js";
import { sendToRole } from "../socket/index.js"; 
import { getReadersForNotification } from "./notificationHelpers.js";
/**
 * Controller: bookingController.js
 * - تم إزالة عمود 'quantity' من منطق الخدمات المباشرة (booking_direct_services)
 * - تم تعديل حساب الخدمات المباشرة لاستخدام guests_count بدلاً من quantity لحساب السعر الإجمالي للخدمة.
 * - ❌ تم إزالة منطق حجز خدمات النقل (booking_transportation)
 */

/* ----------------- Helper: تفاصيل حجز مفصّلة ----------------- */


// دالة مساعدة لإرسال إشعار وحفظه في قاعدة البيانات
async function sendBookingNotification(userId, title, body) {
    try {
        // حفظ الإشعار في جدول notifications
        await db.execute(
            "INSERT INTO notifications (user_id, title, body) VALUES (?, ?, ?)",
            [userId, title, body]
        );

        // جلب كل توكنات الأجهزة للمستخدم
        const [tokens] = await db.execute(
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
        console.error("Booking Notification Error:", err);
    }
}

// ⭐ دالة جديدة: حفظ إشعار في جدول الإشعارات المجدولة
/**
 * حفظ إشعار في جدول الإشعارات المجدولة
 * @param {number} bookingId
 * @param {number} userId
 * @param {string} title
 * @param {string} body
 * @param {Date} scheduledTime - كائن Date لوقت الإرسال
 */
async function scheduleBookingNotification(bookingId, userId, title, body, scheduledTime) {
    try {
        // يتم تحويل Date object إلى تنسيق DATETIME لـ MySQL
        await db.execute(
            `INSERT INTO scheduled_notifications (booking_id, user_id, title, body, scheduled_time) 
             VALUES (?, ?, ?, ?, ?)`,
            [bookingId, userId, title, body, scheduledTime.toISOString().slice(0, 19).replace('T', ' ')]
        );
    } catch (err) {
        console.error("Schedule Notification Error:", err);
    }
}


export async function getBookingDetailsById(bookingId) {
    const [rows] = await db.execute(
        `SELECT b.*, u.full_name AS user_name, u.email AS user_email, u.phone AS user_phone,
             r.id AS room_id, r.name AS room_name, r.description AS room_description, r.capacity, r.price_per_night,
             h.id AS hotel_id, h.name AS hotel_name, h.address AS hotel_address, h.stars AS hotel_stars, h.main_image AS hotel_main_image, h.max_price AS hotel_max_price,h.owner_id AS hotel_owner_id
           FROM bookings b
           LEFT JOIN users u ON b.user_id = u.id
           LEFT JOIN rooms r ON b.room_id = r.id
           LEFT JOIN hotls h ON r.hotel_id = h.id
           WHERE b.id = ?`,
        [bookingId]
    );

    if (!rows[0]) return null;
    const booking = rows[0];


    let nights = 1;
    if (booking.check_in && booking.check_out && booking.room_id) { // الليالي تحسب فقط إذا كانت هناك غرفة محجوزة
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        const diff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        nights = diff > 0 ? diff : 1;
    }

    const room_total = parseFloat(booking.price_per_night || 0) * nights;

    const [hotelData] = await db.execute(`SELECT main_image FROM hotls WHERE id = ?`, [booking.hotel_id]);
    const roomImages = hotelData.length ? [hotelData[0].main_image] : [];

    const [hotelFreeServices] = await db.execute(
        `SELECT id, name, description FROM hotel_amenities WHERE hotel_id = ? AND is_free = 1`,
        [booking.hotel_id]
    );

    // 1. الخدمات الفندقية المدفوعة
    const [hotelPaidServices] = await db.execute(
        `SELECT bps.id, has.id AS service_id, has.name AS service_name, has.price AS service_price, bps.quantity, bps.notes
           FROM booking_paid_services bps
           JOIN hotel_additional_services has ON bps.service_id = has.id
           WHERE bps.booking_id = ?`,
        [bookingId]
    );
    
    // 2. الخدمات المباشرة (السياحية، الفعاليات...)
    const [userDirectServices] = await db.execute(
        `SELECT bds.id, ps.id AS service_id, ps.name AS service_name, ps.price AS service_price, bds.notes, 
              bds.guests_count, bds.trip_datetime, bds.total_price AS line_total
           FROM booking_direct_services bds
           JOIN paid_services ps ON bds.paid_service_id = ps.id
           WHERE bds.booking_id = ?`,
        [bookingId]
    );

    // ❌ تم إزالة منطق جلب خدمات النقل
    // const [transportationServices] = await db.execute(...);

    let services_total = 0;
    
    // حساب مجموع الخدمات الفندقية
    hotelPaidServices.forEach(s => services_total += parseFloat(s.service_price || 0) * (s.quantity || 1));
    
    // حساب مجموع الخدمات المباشرة
    userDirectServices.forEach(s => services_total += parseFloat(s.line_total || 0));

    // ❌ تم إزالة حساب مجموع خدمات النقل

    const grand_total = parseFloat((room_total + services_total).toFixed(2));

    return {
        id: booking.id,
        user: {
            id: booking.user_id,
            name: booking.user_name,
            email: booking.user_email,
            phone: booking.user_phone || null
        },
        hotel: booking.hotel_id ? {
            id: booking.hotel_id,
            name: booking.hotel_name,
            address: booking.hotel_address || null,
            stars: booking.hotel_stars || null,
            main_image: booking.hotel_main_image || null,
            max_price: booking.hotel_max_price || null,
              owner_id: booking.hotel_owner_id ?? null,
        } : null,
        room: booking.room_id ? {
            id: booking.room_id,
            name: booking.room_name,
            description: booking.room_description,
            capacity: booking.capacity,
            price_per_night: booking.price_per_night,
            nights,
            images: (roomImages || []).map(i => i.image_url)
        } : null,
        guests_count: booking.guests_count ?? 1,
        check_in: booking.check_in,
        check_out: booking.check_out,
        status: booking.status,
        totals: {
            room_only_total: room_total.toFixed(2),
            services_total: services_total.toFixed(2),
            grand_total: grand_total.toFixed(2)
        },
        services: {
            hotel_free_services: hotelFreeServices,
            hotel_paid_services: hotelPaidServices,
            user_direct_services: userDirectServices,
            // ❌ تم إزالة إضافة النقل
            // transportation_services: transportationServices
        },
        created_at: booking.created_at,
        updated_at: booking.updated_at
    };
}

/* ----------------- Create Booking (user from token) ----------------- */
export const createBooking = async (req, res) => {
    let connection;
    try {
        const user_id = req.user?.id;
        if (!user_id) return res.status(401).json({ message: "غير مصرح - الرجاء تسجيل الدخول." });

        let {
            room_id,
            check_in,
            check_out,
            guests_count = 1,
            hotel_paid_services = [],
            direct_services = [],
            // ❌ تم إزالة حقول النقل الجديدة
            // transportation_services = []
        } = req.body;

        // التأكد من guests_count
        let guestsCount = Number(guests_count);
        if (!Number.isFinite(guestsCount) || guestsCount < 1) guestsCount = 1;

        // تحقق بسيط: غرفة أو خدمات مباشرة مطلوبين
        const hasDirectServices = Array.isArray(direct_services) && direct_services.length > 0;
        // ❌ تم إزالة التحقق من خدمات النقل
        // const hasTransportServices = Array.isArray(transportation_services) && transportation_services.length > 0;

        if (!room_id && !hasDirectServices) {
            return res.status(400).json({ message: "الرجاء إدخال معرف الغرفة أو خدمات مباشرة." });
        }
        if (Array.isArray(hotel_paid_services) && hotel_paid_services.length > 0 && !room_id) {
            return res.status(400).json({ message: "لا يمكن إضافة خدمات الفندق المدفوعة بدون حجز غرفة." });
        }
        
        // التعديل لحل مشكلة 'check_in cannot be null' عندما لا تكون هناك غرفة محجوزة
        if (!room_id && hasDirectServices) {
            // إذا كان الحجز لخدمات فقط، نمرر تاريخ اليوم كقيمة افتراضية لـ check_in و check_out 
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
            check_in = check_in ?? today;
            check_out = check_out ?? today;
        } else if (room_id) {
            check_in = check_in ?? null;
            check_out = check_out ?? null;
        }


        connection = await db.getConnection();
        await connection.beginTransaction();

        // جلب بيانات الغرفة (لو موجودة)
        let hotel_id = null;
        let price_per_night = 0;
        if (room_id) {
            const [roomRows] = await connection.execute("SELECT id, hotel_id, price_per_night FROM rooms WHERE id = ?", [room_id]);
            if (!roomRows[0]) {
                await connection.rollback();
                return res.status(404).json({ message: "الغرفة غير موجودة." });
            }
            hotel_id = roomRows[0].hotel_id ?? null;
            price_per_night = parseFloat(roomRows[0].price_per_night || 0);
        }

        // حساب الليالي
        let nights = 1;
        if (check_in && check_out && room_id) { 
            const inD = new Date(check_in);
            const outD = new Date(check_out);
            const diffDays = Math.ceil((outD - inD) / (1000 * 60 * 60 * 24));
            nights = diffDays > 0 ? diffDays : 1;
        }
        const room_total = price_per_night * nights;

        // انشاء سجل الحجز مبدئياً مع guests_count
        const [insertRes] = await connection.execute(
            "INSERT INTO bookings (user_id, room_id, check_in, check_out, guests_count, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [user_id, room_id ?? null, check_in, check_out, guestsCount, 0, "pending"]
        );
        const bookingId = insertRes.insertId;

        // حساب وإدراج الخدمات
        let services_total = 0;
        const warnings = [];

        // خدمات الفندق المدفوعة (مرتبطة بالفندق) - لا تغيير
        if (Array.isArray(hotel_paid_services) && hotel_paid_services.length > 0) {
            for (const s of hotel_paid_services) {
                const sid = s.service_id ?? null;
                if (!sid) { warnings.push("تجاهلت خدمة فندقية بدون service_id."); continue; }

                const [svcRows] = await connection.execute(
                    "SELECT id, price, hotel_id FROM hotel_additional_services WHERE id = ?",
                    [sid]
                );
                if (!svcRows[0]) { warnings.push(`الخدمة الفندقية id=${sid} غير موجودة.`); continue; }
                if (hotel_id === null || svcRows[0].hotel_id !== hotel_id) {
                    warnings.push(`الخدمة الفندقية id=${sid} لا تنتمي لفندق الغرفة (تم تجاهلها).`); continue;
                }

                const qty = Number.isFinite(Number(s.quantity)) && Number(s.quantity) > 0 ? Number(s.quantity) : 1;
                const price = parseFloat(svcRows[0].price || 0);

                await connection.execute(
                    "INSERT INTO booking_paid_services (booking_id, service_id, quantity, notes) VALUES (?, ?, ?, ?)",
                    [bookingId, sid, qty, s.notes ?? null]
                );
                services_total += price * qty;
            }
        }

        // الخدمات المباشرة (السياحية، الفعاليات...)
        if (hasDirectServices) {
            for (const s of direct_services) {
                const sid = s.service_id ?? null;
                if (!sid) { warnings.push("تجاهلت خدمة مباشرة بدون service_id."); continue; }

                const [svcRows] = await connection.execute("SELECT id, price FROM paid_services WHERE id = ?", [sid]);
                if (!svcRows[0]) { warnings.push(`الخدمة المباشرة id=${sid} غير موجودة.`); continue; }

                // استخدام guests_count كـ 'كمية' (العدد) لحساب السعر الإجمالي
                const guests = Number.isFinite(Number(s.guests_count)) && Number(s.guests_count) > 0 ? Number(s.guests_count) : guestsCount; // استخدام guestsCount للحجز كقيمة افتراضية
                const price = parseFloat(svcRows[0].price || 0);
                const line_total = parseFloat((price * guests).toFixed(2)); 
                
                await connection.execute(
                    "INSERT INTO booking_direct_services (booking_id, paid_service_id, notes, guests_count, trip_datetime, total_price) VALUES (?, ?, ?, ?, ?, ?)",
                    [bookingId, sid, s.notes ?? null, guests, s.trip_datetime ?? null, line_total]
                );
                services_total += line_total;
            }
        }
        
        // ❌ تم إزالة منطق خدمات النقل
        /*
        if (hasTransportServices) {
            // ... منطق النقل المحذوف ...
        }
        */

        // تحديث السعر النهائي
        const grand_total = parseFloat((room_total + services_total).toFixed(2));
        await connection.execute("UPDATE bookings SET total_price = ? WHERE id = ?", [grand_total, bookingId]);

        await connection.commit();

        // ارجع تفاصيل الحجز كاملة
        const bookingDetails = await getBookingDetailsById(bookingId);

        // ✅ حفظها في جدول booking_cart تلقائياً
        await db.execute(
            "INSERT INTO booking_cart (user_id, booking_id, booking_data) VALUES (?, ?, ?)",
            [user_id, bookingId, JSON.stringify(bookingDetails)]
        );
        
        // **********************************************
        // ⭐ منطق جدولة الإشعارات الجديدة
        // **********************************************
        
        if (room_id && check_in && check_out) {
            const checkInDate = new Date(check_in);
            const checkOutDate = new Date(check_out);
            
            // 1. إشعار قبل الوصول بـ 30 دقيقة
            const preCheckInTime = new Date(checkInDate.getTime() - (30 * 60 * 1000));
            
            // نجدول فقط إذا كان وقت الإرسال المستقبلي لم يمر بعد
            if (preCheckInTime > new Date()) { 
                await scheduleBookingNotification(
                    bookingId,
                    user_id,
                    "تذكير بالوصول! 🛎️",
                    `موعد وصولك لـ ${bookingDetails.hotel.name} بعد 30 دقيقة.`,
                    preCheckInTime
                );
            }
            
            // 2. إشعار قبل المغادرة بـ 30 دقيقة
            const preCheckOutTime = new Date(checkOutDate.getTime() - (30 * 60 * 1000));
            
            // نجدول فقط إذا كان وقت الإرسال المستقبلي لم يمر بعد
            if (preCheckOutTime > new Date()) { 
                await scheduleBookingNotification(
                    bookingId,
                    user_id,
                    "تذكير بالمغادرة! 👋",
                    `موعد مغادرتك من ${bookingDetails.hotel.name} بعد 30 دقيقة. نتمنى لك رحلة سعيدة.`,
                    preCheckOutTime
                );
            }
        }const title = "Book a new room";
const body = `user ${bookingDetails.user.name} Book a room in ${bookingDetails.hotel?.name || 'Hotel'} � Total: ${grand_total.toFixed(2)}`;
const notificationType = "room_booking";

// hotel_id ����� �� ������ ������
// owner_id ����� �� bookingDetails
const owner_id = bookingDetails.hotel?.owner_id ?? null;

// ����� ������� �� ���� admin_notifications
const [insNotif] = await connection.execute(
  "INSERT INTO admin_notifications (title, body, type, hotel_id, owner_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  [title, body, notificationType, hotel_id, owner_id, new Date()]
);

const notificationId = insNotif.insertId;

// === ��� ����� ������ ===
const readers = await getReadersForNotification({
  type: notificationType,
  hotel_id: hotel_id,
  owner_id: owner_id
});

// === ����� notification_reads ���� ����� ===
if (readers.length) {
  const values = [];
  const placeholders = [];
  const now = new Date();

  for (const uid of readers) {
    placeholders.push("(?, ?, NULL, ?)");
    values.push(notificationId, uid, now);
  }

  const insertQuery = `
    INSERT INTO notification_reads (notification_id, user_id, read_at, created_at)
    VALUES ${placeholders.join(",")}
    ON DUPLICATE KEY UPDATE created_at = VALUES(created_at)
  `;

  await connection.execute(insertQuery, values);
}

// === �����: notify admin ===
sendToRole("admin", "newRoomBooking", {
  bookingId,
  user: bookingDetails.user,
  hotel: bookingDetails.hotel,
  message: title,
  notificationId
});

// === �����: notify hotel owner ===
if (owner_id) {
  sendToRole(`hotel_owner_${owner_id}`, "newRoomBooking", {
    bookingId,
    user: bookingDetails.user,
    hotel: bookingDetails.hotel,
    room: bookingDetails.room,
    message: title,
    notificationId
  });
}

// === ����� unread_count ===
for (const uid of readers) {
  const [cntRows] = await db.execute(
    "SELECT COUNT(*) AS cnt FROM notification_reads WHERE user_id = ? AND read_at IS NULL",
    [uid]
  );
  const unread_count = cntRows[0]?.cnt ?? 0;

  // ��� ��� �������� ������ ������ ��������
  const [uRows] = await db.execute("SELECT role FROM users WHERE id = ?", [uid]);
  const role = uRows[0]?.role || null;

  if (role === "admin") {
    sendToRole("admin", "unreadCount", { unread_count });
  } else if (role === "hotel_owner" || role === "hotel_admin") {
    sendToRole(`hotel_owner_${uid}`, "unreadCount", { unread_count });
  } else {
    sendToRole(`user_${uid}`, "unreadCount", { unread_count });
  }
}

        
        // إشعار فوري لإنشاء الحجز
        await sendBookingNotification(
            user_id,
            "تم إنشاء حجز جديد",
            `تم إنشاء حجزك بنجاح. المجموع النهائي: ${grand_total} د.أ`
        );
        
        return res.status(201).json({ booking: bookingDetails, warnings });

    } catch (err) {
        if (connection) {
            try { await connection.rollback(); } catch (e) { /* ignore */ }
        }
        console.error("createBooking error:", err);
        // نرجع رسالة خطأ واضحة للمستخدم
        return res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
};
// ... بقية دوال الـ Controller ...
/* ----------------- Get all bookings (admin / public) ----------------- */
export const getAllBookings = async (req, res) => {
    try {
        // إن أردت تقييده للأدمن ضع middleware مناسب على الراوتر
        const [rows] = await db.execute("SELECT id FROM bookings ORDER BY created_at DESC");
        const list = [];
        for (const r of rows) {
            const d = await getBookingDetailsById(r.id);
            if (d) list.push(d);
        }
        res.json({ bookings: list });
    } catch (error) {
        console.error("getAllBookings error:", error);
        res.status(500).json({ error: error.message });
    }
};

/* ----------------- Get bookings for current user ----------------- */
/* ----------------- Get bookings for current user ----------------- */
export const getUserBookings = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) return res.status(401).json({ message: "غير مصرح - الرجاء تسجيل الدخول." });

        // 💡 التعديل: إضافة الشرط 'AND room_id IS NOT NULL'
        const [rows] = await db.execute(
            "SELECT id FROM bookings WHERE user_id = ? AND room_id IS NOT NULL ORDER BY created_at DESC", 
            [user_id]
        );

        const list = [];
        for (const r of rows) {
            const d = await getBookingDetailsById(r.id);
            if (d) list.push(d);
        }
        res.json({ bookings: list });
    } catch (error) {
        console.error("getUserBookings error:", error);
        res.status(500).json({ error: error.message });
    }
};

/* ----------------- Get current (active) booking for user ----------------- */
export const getUserCurrentBooking = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) return res.status(401).json({ message: "غير مصرح - الرجاء تسجيل الدخول." });

        // تعريف "الحالي": تاريخ اليوم بين check_in و check_out أو حالات معينة
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
        const [rows] = await db.execute(
            `SELECT id FROM bookings
             WHERE user_id = ?
               AND (
                   (check_in IS NOT NULL AND check_out IS NOT NULL AND ? BETWEEN DATE(check_in) AND DATE(check_out))
                   OR status IN ('ongoing','checked_in','in_progress')
                 )
             ORDER BY created_at DESC
             LIMIT 1`,
            [user_id, todayStr]
        );

        if (!rows[0]) return res.json({ booking: null });

        const booking = await getBookingDetailsById(rows[0].id);
        res.json({ booking });
    } catch (error) {
        console.error("getUserCurrentBooking error:", error);
        res.status(500).json({ error: error.message });
    }
};

/* ----------------- Get booking by id (owner or admin) ----------------- */
export const getBookingById = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        // جلب تفاصيل الحجز
        const booking = await getBookingDetailsById(id);
        if (!booking) return res.status(404).json({ message: "الحجز غير موجود" });

        // 🔹 جلب صاحب الفندق المرتبط بهذا الحجز
        const [hotelOwner] = await db.execute(`
            SELECT h.owner_id
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN hotls h ON r.hotel_id = h.id
            WHERE b.id = ?
            `, [id]);

        const ownerId = hotelOwner[0]?.owner_id;

        // 🔹 التحقق من الصلاحيات
        if (
            user &&
            user.role !== 'admin' && // ليس أدمن
            booking.user.id !== user.id && // ليس صاحب الحجز
            ownerId !== user.id // ليس صاحب الفندق
        ) {
            return res.status(403).json({ message: "لا يمكنك الوصول لهذا الحجز." });
        }

        return res.status(200).json({ booking });
    } catch (error) {
        console.error("getBookingById error:", error);
        return res.status(500).json({ message: "حدث خطأ أثناء جلب الحجز" });
    }
};


/* ----------------- Update booking details (owner or admin) ----------------- */
export const updateBookingDetails = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const { guests_count, check_in, check_out } = req.body; // قابل للتوسع لاحقاً

        // تحقق وجود الحجز
        const [found] = await db.execute("SELECT user_id FROM bookings WHERE id = ?", [id]);
        if (!found[0]) return res.status(404).json({ message: "الحجز غير موجود." });

        if (!user) return res.status(401).json({ message: "غير مصرح." });
        if (user.role !== 'admin' && found[0].user_id !== user.id) {
            return res.status(403).json({ message: "لا تملك صلاحية تعديل هذا الحجز." });
        }


        const updates = [];
        const params = [];

        if (typeof guests_count !== "undefined") {
            const gc = Number(guests_count);
            if (!Number.isFinite(gc) || gc < 1) return res.status(400).json({ message: "guests_count يجب أن يكون عدداً صحيحاً موجباً." });
            updates.push("guests_count = ?");
            params.push(gc);
        }

        if (typeof check_in !== "undefined") {
            updates.push("check_in = ?");
            params.push(check_in);
        }

        if (typeof check_out !== "undefined") {
            updates.push("check_out = ?");
            params.push(check_out);
        }

        if (updates.length === 0) return res.status(400).json({ message: "لا توجد حقول للتحديث." });

        params.push(id);
        const sql = `UPDATE bookings SET ${updates.join(", ")} WHERE id = ?`;
        await db.execute(sql, params);

        // — إذا عدلت التواريخ وترغب بإعادة حساب total_price بناءً على الليالي + الخدمات يمكن إضافته هنا.
        const updated = await getBookingDetailsById(id);
        res.json({ message: "تم تحديث الحجز بنجاح", booking: updated });
    } catch (error) {
        console.error("updateBookingDetails error:", error);
        res.status(500).json({ error: error.message });
    }
};

/* ----------------- Update booking status (owner or admin) ----------------- */
export const updateBookingStatus = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const { status } = req.body;

        const [found] = await db.execute("SELECT user_id FROM bookings WHERE id = ?", [id]);
        if (!found[0]) return res.status(404).json({ message: "الحجز غير موجود." });

        if (!user) return res.status(401).json({ message: "غير مصرح." });
        if (user.role !== 'hotel' && found[0].user_id !== user.id) {
            return res.status(403).json({ message: "لا تملك صلاحية تعديل حالة هذا الحجز." });
        }

        await db.execute("UPDATE bookings SET status=? WHERE id=?", [status, id]);
        const updated = await getBookingDetailsById(id);
        res.json({ message: "تم تحديث حالة الحجز بنجاح", booking: updated });
    } catch (error) {
        console.error("updateBookingStatus error:", error);
        res.status(500).json({ error: error.message });
    }
};

/* ----------------- Delete booking (owner or admin) ----------------- */
export const deleteBooking = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const [found] = await db.execute("SELECT user_id FROM bookings WHERE id = ?", [id]);
        if (!found[0]) return res.status(404).json({ message: "الحجز غير موجود." });

        if (!user) return res.status(401).json({ message: "غير مصرح." });
        if (user.role !== 'admin' && found[0].user_id !== user.id) {
            return res.status(403).json({ message: "لا تملك صلاحية حذف هذا الحجز." });
        }

 
        await db.execute("DELETE FROM booking_paid_services WHERE booking_id = ?", [id]);
        await db.execute("DELETE FROM booking_direct_services WHERE booking_id = ?", [id]);
        await db.execute("DELETE FROM bookings WHERE id = ?", [id]); // ❌ تم إزالة حذف النقل

        res.json({ message: "تم حذف الحجز بنجاح" });
    } catch (error) {
        console.error("deleteBooking error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getUserCart = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({ message: "غير مصرح - الرجاء تسجيل الدخول." });
        }

    
        const [rows] = await db.execute(
            "SELECT id, booking_id, booking_data, created_at FROM booking_cart WHERE user_id = ? ORDER BY created_at DESC",
            [user_id]
        );

    
        const cart = rows.map(row => ({
            id: row.id,
            booking_id: row.booking_id,
            booking_data: (() => {
                try {
                    return JSON.parse(row.booking_data);
                } catch (err) {
                    console.error("JSON parse error for booking_cart.id =", row.id, err);
                    return {};
                }
            })(),
            created_at: row.created_at
        }));

        
        res.status(200).json({ cart });

    } catch (error) {
        console.error("getUserCart error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteFromCart = async (req, res) => {
    try {
        const user_id = req.user?.id;
        const { id } = req.params;
        if (!user_id) return res.status(401).json({ message: "غير مصرح." });

        await db.execute("DELETE FROM booking_cart WHERE id = ? AND user_id = ?", [id, user_id]);
        res.json({ message: "تم حذف الحجز من السلة بنجاح." });
    } catch (error) {
        console.error("deleteFromCart error:", error);
        res.status(500).json({ error: error.message });
    }
};


export const getOwnerHotels = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ message: "غير مصرح." });
        if (user.role === "admin") {

            const [rows] = await db.execute("SELECT id, name FROM hotls ORDER BY id DESC");
            return res.json({ hotels: rows });
        }
        const [rows] = await db.execute("SELECT id, name FROM hotls WHERE owner_id = ?", [user.id]);
        res.json({ hotels: rows });
    } catch (err) {
        console.error("getOwnerHotels error:", err);
        res.status(500).json({ error: err.message });
    }
};


export const getBookingsByHotel = async (req, res) => {
  try {
    const user = req.user;
    const hotelIdRaw = req.params.hotelId || req.query.hotelId;
    if (!hotelIdRaw) return res.status(400).json({ message: "hotelId �����" });

    // pagination: ���� �� ����� ������� (fallback ���)
    let page = parseInt(req.query.page, 10);
    if (!Number.isFinite(page) || page < 1) page = 1;
    let limit = parseInt(req.query.limit, 10);
    if (!Number.isFinite(limit) || limit < 1) limit = 25;
    limit = Math.min(100, limit);
    const offset = (page - 1) * limit;

    // filters
    const status = typeof req.query.status === "string" && req.query.status.trim() !== "" ? req.query.status.trim() : null;
    const from = typeof req.query.from === "string" && req.query.from.trim() !== "" ? req.query.from.trim() : null;
    const to = typeof req.query.to === "string" && req.query.to.trim() !== "" ? req.query.to.trim() : null;

    const hotelId = String(hotelIdRaw);

    // build SQL: �� ������� ������ ���� ���� (��� ��� ������) ����� ����� placeholder �� LIMIT/OFFSET
    let sql = `SELECT DISTINCT b.id, b.created_at
               FROM bookings b
               JOIN rooms r ON b.room_id = r.id
               JOIN hotls h ON r.hotel_id = h.id
               WHERE h.id = ?`;
    const params = [hotelId];

    if (status) { sql += ` AND b.status = ?`; params.push(status); }
    if (from)   { sql += ` AND DATE(b.check_in) >= ?`; params.push(from); }
    if (to)     { sql += ` AND DATE(b.check_out) <= ?`; params.push(to); }

    // ��� LIMIT � OFFSET ������ �� ���� (��� ������)
    sql += ` ORDER BY b.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    // logs ������ ������ �� �����
    console.log("[getBookingsByHotel] SQL:", sql);
    console.log("[getBookingsByHotel] params:", params);
    console.log("[getBookingsByHotel] numeric -> limit:", limit, "offset:", offset, "page:", page);

    // sanitize params � ��� null ��� undefined ����� Date ��� string
    const safeParams = params.map(p => {
      if (p === undefined) return null;
      if (p === null) return null;
      if (p instanceof Date) return p.toISOString().slice(0, 19).replace("T", " ");
      const t = typeof p;
      if (t === "string" || t === "number" || t === "boolean") return p;
      try { return JSON.stringify(p); } catch (e) { return String(p); }
    });

    const [rows] = await db.execute(sql, safeParams);

    const list = [];
    for (const r of rows) {
      const d = await getBookingDetailsById(r.id);
      if (d) list.push(d);
    }

    // count query (���� ���� JOIN) � ��� ����� ��� ������� ������
    let countSql = `SELECT COUNT(DISTINCT b.id) AS total
                    FROM bookings b
                    JOIN rooms r ON b.room_id = r.id
                    JOIN hotls h ON r.hotel_id = h.id
                    WHERE h.id = ?`;
    const countParams = [hotelId];
    if (status) countParams.push(status);
    if (from) countParams.push(from);
    if (to) countParams.push(to);

    console.log("[getBookingsByHotel] countSql:", countSql, "countParams:", countParams);
    const [countRows] = await db.execute(countSql, countParams);
    const total = (countRows[0] && countRows[0].total) ? countRows[0].total : list.length;

    return res.json({ bookings: list, total, page, limit, hotelId });
  } catch (err) {
    console.error("getBookingsByHotel error:", err);
    // �� ������� ���� ������ ����
    if (process.env.NODE_ENV !== "production") {
      return res.status(500).json({ error: err.message, code: err.code, sqlMessage: err.sqlMessage, sql: err.sql });
    }
    return res.status(500).json({ error: "��� ��� ������ ���� ��� �������." });
  }
};



export const getRoomsWithBookingsByHotel = async (req, res) => {
    try {
        const hotelId = req.params.hotelId;
        if (!hotelId) return res.status(400).json({ message: "hotelId مطلوب" });

        const [rows] = await db.execute(
            `SELECT r.*, 
             (SELECT COUNT(*) FROM bookings b WHERE b.room_id = r.id) AS bookings_count
             FROM rooms r
             WHERE r.hotel_id = ?
             ORDER BY r.id ASC`,
            [hotelId]
        );
        res.json({ rooms: rows });
    } catch (err) {
        console.error("getRoomsWithBookingsByHotel error:", err);
        res.status(500).json({ error: err.message });
    }
};
export const getTopHotels = async (req, res) => {
    try {
        // ���� ��� �������� ��� ���� �� ���� �������
        const [rows] = await db.execute(`
            SELECT h.id, h.name, h.stars, h.main_image, h.min_price, h.max_price, COUNT(b.id) AS bookings_count
            FROM hotls h
            LEFT JOIN rooms r ON r.hotel_id = h.id
            LEFT JOIN bookings b ON b.room_id = r.id
            GROUP BY h.id
            ORDER BY bookings_count DESC
            LIMIT 5
        `);

        // ��� �� �� �� ��� ��� ���ޡ ���� ��� 5 ����� ������ �� ���� �������
        if (!rows.some(r => r.bookings_count > 0)) {
            const [fallback] = await db.execute(`
                SELECT id, name, stars, main_image, min_price, max_price
                FROM hotls
                ORDER BY id ASC
                LIMIT 5
            `);
            return res.json({ hotels: fallback });
        }

        res.json({ hotels: rows });
    } catch (err) {
        console.error("getTopHotels error:", err);
        res.status(500).json({ error: err.message });
    }
};