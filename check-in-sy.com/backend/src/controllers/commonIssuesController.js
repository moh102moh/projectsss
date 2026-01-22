import { getAllCommonIssues } from "../models/commonIssuesModel.js";

// ✅ عرض المشاكل الشائعة
export async function getCommonIssues(req, res) {
  try {
    const issues = await getAllCommonIssues();
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب المشاكل الشائعة.", error: err.message });
  }
}
