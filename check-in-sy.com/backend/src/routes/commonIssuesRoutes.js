import express from "express";
import { getCommonIssues } from "../controllers/commonIssuesController.js";

const router = express.Router();

// المستخدمون كلهم يستطيعون مشاهدة المشاكل الشائعة
router.get("/", getCommonIssues);

export default router;
