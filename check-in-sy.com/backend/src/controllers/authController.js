// src/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import admin from "../utils/firebase.js";
import {
  createUser,
  getUserByEmail,
  getAllUsers,
  updateUserById,
  deleteUserById,
  getUserById,
  updateUserVerification,
  setResetCode,
  updatePasswordByResetCode,
} from "../models/userModel.js";
import { sendEmail } from "../utils/emailService.js";

async function sendUserNotification(userId, title, body) {
  try {
    // 1️⃣ حفظ الإشعار في قاعدة البيانات
    await pool.query(
      `INSERT INTO notifications (user_id, title, body) VALUES (?, ?, ?)`,
      [userId, title, body]
    );

    // 2️⃣ جلب كل توكنات الأجهزة للمستخدم
    const [tokens] = await pool.query(
      "SELECT fcm_token FROM user_device_tokens WHERE user_id = ?",
      [userId]
    );

    if (tokens.length === 0) return;

    // 3️⃣ إعداد الرسائل للإرسال عبر Firebase
    const messages = tokens.map(t => ({
      token: t.fcm_token,
      notification: { title, body },
    }));

    await Promise.all(messages.map(msg => admin.messaging().send(msg)));

  } catch (err) {
    console.log("Notification Error:", err);
  }
}

/* ---------- REGISTER (create + send verify code) ---------- */
/* ---------- REGISTER (create + send verify code) ---------- */
export async function register(req, res) {
    try {
        // ... (باقي المتغيرات)
        const { full_name, email, phone, password, confirm_password } = req.body;
        let { role } = req.body; // نستخدم let هنا للسماح بتعديل قيمة role

        // -------------------- 💡 التعديل الخاص بتحديد الدور الافتراضي 💡 --------------------
        // إذا لم يتم تمرير دور، يتم تعيينه افتراضياً إلى 'customer'
        if (!role) {
            role = 'customer';
        }
        
        if (!full_name || !email || !phone || !password || !confirm_password) {
            return res.status(400).json({ message: "الرجاء إدخال جميع الحقول المطلوبة." });
        }

        if (password !== confirm_password) {
            return res.status(400).json({ message: "كلمتا المرور غير متطابقتين." });
        }

        const existing = await getUserByEmail(email);
        if (existing) {
            return res.status(400).json({ message: "هذا البريد مستخدم مسبقاً." });
        }

        // -------------------- 💡 التعديل الخاص بالتفعيل الإلزامي 💡 --------------------
        // يتم التفعيل الإلزامي فقط إذا كان الدور هو 'customer'
        const isCustomer = role.toLowerCase() === 'customer'; 
        let verify_code = null;
        let responseMessage;

        if (isCustomer) {
            // الزبون: نولد الرمز ونرسل الإيميل
            verify_code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 أرقام
            await sendEmail(email, "رمز تفعيل حسابك", `رمز التفعيل هو: <b>${verify_code}</b>`);
            responseMessage = "تم إنشاء الحساب. تم إرسال رمز التفعيل إلى بريدك.";
        } else {
            // الأدوار الأخرى: لا تحتاج تفعيل، نمرر null لـ verify_code لكي يتم تفعيل الحساب مباشرة
            verify_code = null; 
            responseMessage = "تم إنشاء الحساب بنجاح. يمكنك تسجيل الدخول.";
        }

        const userId = await createUser(full_name, email, phone, password, role, verify_code);

        // استرجاع بيانات المستخدم الجديد
        const user = await getUserByEmail(email);

        // توليد توكن JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: responseMessage,
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                is_verified: user.is_verified, 
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/* ---------- VERIFY EMAIL ---------- */
export async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "الرجاء إدخال البريد والرمز." });

    const ok = await updateUserVerification(email, code);
    if (!ok) return res.status(400).json({ message: "رمز غير صحيح أو البريد غير موجود." });

    res.json({ message: "تم تفعيل الحساب بنجاح." });
  } catch (err) {
    res.status(500).json({ message: "خطأ أثناء التفعيل.", error: err.message });
  }
}

/* ---------- LOGIN ---------- */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "الرجاء إدخال البريد وكلمة المرور." });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود." });

    // -------------------- 💡 التعديل يبدأ هنا 💡 --------------------
    // نحدد ما إذا كان المستخدم زبوناً
    const isCustomer = user.role.toLowerCase() === 'customer';

    // منع الدخول فقط إذا كان الدور 'customer' ولم يتم التفعيل بعد
    if (isCustomer && !user.is_verified) {
        return res.status(403).json({ message: "يجب تفعيل الحساب أولاً." });
    }
    // -------------------- 💡 التعديل ينتهي هنا 💡 --------------------

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "كلمة المرور غير صحيحة." });

 const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

await sendUserNotification(
  user.id,
  "تسجيل دخول",
  "لقد قمت بتسجيل الدخول إلى حسابك."
);


    res.json({
      message: "تم تسجيل الدخول بنجاح.",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
/* ---------- FORGOT PASSWORD (send reset code) ---------- */
export async function sendResetCode(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "الرجاء إدخال البريد." });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: "البريد غير موجود." });

    const reset_code = Math.floor(100000 + Math.random() * 900000).toString();
    await setResetCode(email, reset_code);
    await sendEmail(email, "رمز استعادة كلمة المرور", `رمز الاستعادة هو: <b>${reset_code}</b>`);

    res.json({ message: "تم إرسال رمز الاستعادة إلى بريدك." });
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ أثناء الإرسال.", error: err.message });
  }
}

/* ---------- RESET PASSWORD (using code) ---------- */
export async function resetPassword(req, res) {
  try {
    const { code, new_password, confirm_password } = req.body;

    if (!code || !new_password || !confirm_password)
      return res.status(400).json({ message: "الرجاء إدخال جميع المعلومات." });

    if (new_password !== confirm_password)
      return res.status(400).json({ message: "كلمتا المرور غير متطابقتين." });

    // جلب المستخدم بحسب رمز الاستعادة
    const [rows] = await pool.query(
      "SELECT id FROM users WHERE reset_code = ?",
      [code]
    );
    const user = rows[0];

    if (!user)
      return res.status(400).json({ message: "رمز غير صحيح أو منتهي." });

    // تحديث كلمة المرور
    await updatePasswordByResetCode(code, new_password);

    // إرسال إشعار
    await sendUserNotification(
      user.id,
      "تغيير كلمة المرور",
      "تم تغيير كلمة المرور الخاصة بك بنجاح."
    );

    res.json({ message: "تم تغيير كلمة المرور بنجاح." });

  } catch (err) {
    res.status(500).json({ message: "حدث خطأ.", error: err.message });
  }
}


/* ---------- Existing admin/user endpoints ---------- */
export async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب المستخدمين", error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { full_name, email, phone, role, password } = req.body;

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updated = await updateUserById(userId, { full_name, email, phone, role, password: hashedPassword });
    if (!updated) return res.status(404).json({ message: "المستخدم غير موجود" });
await sendUserNotification(
  userId,
  "تحديث بيانات الحساب",
  "تم تحديث بيانات حسابك بنجاح."
);

    res.json({ message: "تم تحديث المستخدم بنجاح" });
  } catch (err) {
    res.status(500).json({ message: "خطأ في تحديث المستخدم", error: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    const deleted = await deleteUserById(userId);
    if (!deleted) return res.status(404).json({ message: "المستخدم غير موجود" });

    res.json({ message: "تم حذف المستخدم بنجاح" });
  } catch (err) {
    res.status(500).json({ message: "خطأ في حذف المستخدم", error: err.message });
  }
}

export async function getMyProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود." });

    res.json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
      is_verified: user.is_verified,
    });
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات.", error: err.message });
  }
}

export async function updateMyProfile(req, res) {
  try {
    const userId = req.user.id;
    const { full_name, email, phone, password } = req.body;

    let hashedPassword;
    if (password) hashedPassword = await bcrypt.hash(password, 10);

    const updated = await updateUserById(userId, {
      full_name,
      email,
      phone,
      password: hashedPassword,
    });

    if (!updated) return res.status(404).json({ message: "المستخدم غير موجود." });
    res.json({ message: "تم تحديث بياناتك بنجاح." });
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ أثناء التحديث.", error: err.message });
  }
}

export async function deleteMyAccount(req, res) {
  try {
    const userId = req.user.id;
    const deleted = await deleteUserById(userId);
    if (!deleted) return res.status(404).json({ message: "المستخدم غير موجود." });

    res.json({ message: "تم حذف حسابك بنجاح." });
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ أثناء حذف الحساب.", error: err.message });
  }
}export async function verifyResetCode(req, res) {
  try {
    const { email, code } = req.body;

    if (!email || !code)
      return res.status(400).json({ message: "الرجاء إدخال البريد والرمز." });

    const user = await getUserByEmail(email);
    if (!user || user.reset_code !== code)
      return res.status(400).json({ message: "رمز غير صحيح." });

    res.json({ message: "رمز صحيح، يمكنك تغيير كلمة المرور." });
  } catch (err) {
    res.status(500).json({ message: "خطأ أثناء التحقق.", error: err.message });
  }
}