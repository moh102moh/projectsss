import {
  createSupportTicket,
  getTicketsByUser,
  getAllTickets,
  updateTicketStatus,
} from "../models/supportModel.js";
import admin from "../utils/firebase.js";
import pool from "../config/db.js";
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

// ✅ إرسال طلب دعم فني جديد
export async function createTicket(req, res) {
  try {
    const userId = req.user.id;
    const { subject, description } = req.body;

    if (!subject || !description)
      return res.status(400).json({ message: "الرجاء إدخال عنوان ووصف المشكلة." });

    const ticketId = await createSupportTicket(userId, subject, description);
  await sendNotification(
      userId,
      "تم إنشاء طلب دعم فني",
      `تم إرسال طلبك "${subject}" بنجاح. سنقوم بالرد عليك قريبًا.`
    );
    res.status(201).json({
      message: "تم إرسال الطلب بنجاح.",
      ticket_id: ticketId,
    });
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الطلب.", error: err.message });
  }
}

// ✅ جلب الطلبات الخاصة بالمستخدم الحالي
export async function getMyTickets(req, res) {
  try {
    const userId = req.user.id;
    const tickets = await getTicketsByUser(userId);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الطلبات.", error: err.message });
  }
}

// ✅ جلب جميع الطلبات (للمشرف فقط)
export async function getAllSupportTickets(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "غير مصرح - المشرف فقط يمكنه رؤية جميع الطلبات." });
    }

    const tickets = await getAllTickets();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب جميع الطلبات.", error: err.message });
  }
}

// ✅ تحديث حالة الطلب (admin فقط)
export async function updateTicket(req, res) {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "غير مصرح - المشرف فقط يمكنه تعديل الحالة." });

    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "in_progress", "closed"].includes(status)) {
      return res.status(400).json({ message: "حالة غير صحيحة." });
    }

    const updated = await updateTicketStatus(id, status);
    if (!updated) return res.status(404).json({ message: "الطلب غير موجود." });

    res.json({ message: "تم تحديث حالة الطلب بنجاح." });
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ أثناء التحديث.", error: err.message });
  }
}
