import jwt from "jsonwebtoken";
import db from "../config/db.js";
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
export const verifyHotelToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "غير مصرح - لا توكن" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "توكن غير صالح" });

    // نضع القيم في req لاستخدامها لاحقاً
    req.userId = decoded.id;
    req.role = decoded.role;
    req.hotelId = decoded.hotelId; // مهم جداً: يحدد أي فندق يعمل CRUD
    next();
  } catch (err) {
    console.error("verifyHotelToken:", err);
    return res.status(401).json({ message: "توكن غير صالح أو منتهي" });
  }
};
export async function verifyHotelOwner(req, res, next) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "غير مصرح." });
    if (user.role === "hotel") return next();


    const hotelId = req.params.hotelId || req.body.hotel_id || req.query.hotelId;
    if (!hotelId) return res.status(400).json({ message: "معرف الفندق مطلوب للتحقق." });

    const [rows] = await db.execute("SELECT owner_id FROM hotls WHERE id = ?", [hotelId]);
    if (!rows[0]) return res.status(404).json({ message: "الفندق غير موجود." });

    console.log("hotelId:", hotelId, "owner_id:", rows[0].owner_id, "user.id:", user.id);

    // 🔹 بدل الشرط مؤقتًا للتجريب فقط
    if (String(rows[0].owner_id) !== String(user.id)) {
      return res.status(403).json({ message: `صلاحية مرفوضة: owner=${rows[0].owner_id}, user=${user.id}` });
    }

    next();
  } catch (err) {
    console.error("verifyHotelOwner error:", err);
    return res.status(500).json({ error: err.message });
  }
}
export const verifyBookingAccess = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const user = req.user;

    if (!bookingId) return res.status(400).json({ message: "معرف الحجز مفقود" });

    const [rows] = await db.execute(
      `SELECT b.user_id, r.hotel_id, h.owner_id
       FROM bookings b
       LEFT JOIN rooms r ON b.room_id = r.id
       LEFT JOIN hotls h ON r.hotel_id = h.id
       WHERE b.id = ?`,
      [bookingId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "الحجز غير موجود." });
    }

    const booking = rows[0];

    // ✅ يسمح إذا المستخدم هو صاحب الحجز أو مالك الفندق
    if (booking.user_id === user.id || booking.owner_id === user.id) {
      return next();
    }

    return res.status(403).json({ message: "لا يمكنك الوصول لهذا الحجز." });
  } catch (err) {
    console.error("verifyBookingAccess error:", err);
    return res.status(500).json({ error: err.message });
  }
};
export function verifyUserToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "غير مصرح - التوكن مفقود." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(403).json({ message: "توكن غير صالح." });
  }
}