import pool from "../config/db.js";

// ✅ إنشاء تذكرة جديدة
export async function createSupportTicket(user_id, subject, description) {
  const [result] = await pool.query(
    "INSERT INTO support_tickets (user_id, subject, description) VALUES (?, ?, ?)",
    [user_id, subject, description]
  );
  return result.insertId;
}

// ✅ جلب جميع التذاكر لمستخدم معين
export async function getTicketsByUser(user_id) {
  const [rows] = await pool.query(
    "SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC",
    [user_id]
  );
  return rows;
}

// ✅ جلب جميع التذاكر (للمشرفين)
export async function getAllTickets() {
  const [rows] = await pool.query(
    `SELECT t.*, u.full_name, u.email 
     FROM support_tickets t
     LEFT JOIN users u ON t.user_id = u.id
     ORDER BY t.created_at DESC`
  );
  return rows;
}

// ✅ تحديث حالة التذكرة
export async function updateTicketStatus(id, status) {
  const [result] = await pool.query("UPDATE support_tickets SET status=? WHERE id=?", [status, id]);
  return result.affectedRows > 0;
}
