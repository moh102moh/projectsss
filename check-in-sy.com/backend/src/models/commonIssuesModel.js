import pool from "../config/db.js";

// ✅ جلب كل المشاكل الشائعة
export async function getAllCommonIssues() {
  const [rows] = await pool.query("SELECT * FROM common_issues ORDER BY id ASC");
  return rows;
}
