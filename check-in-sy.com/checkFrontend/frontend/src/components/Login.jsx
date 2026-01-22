// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "خطأ في تسجيل الدخول");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // التوجيه بناءً على الدور المُستلَم
      if (data.user.role === "admin") navigate("/admin-dashboard");
      else if (data.user.role === "hotel") navigate("/hotel-dashboard");
      else if (data.user.role === "delivery") navigate("/dashboard/drivers"); // تم التوجيه إلى لوحة تحكم التوصيل (السيارات)
      else alert("🚫 غير مصرح لك بالدخول!");
      
    } catch (err) {
      console.error(err);
      alert("خطأ في الاتصال بالسيرفر");
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <h1>لوحة التحكم</h1>
      </div>

      <div className="login-card">
        <h2>تسجيل الدخول (Admin) 👋</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">تسجيل الدخول</button>
        </form>

        {/* 👇 الأزرار الجديدة للتوجيه إلى صفحات تسجيل الدخول الأخرى */}
        <div className="role-switcher">
          <p>أو سجل الدخول كـ:</p>
          <button 
            type="button" 
            className="btn switcher-btn hotel-btn" 
            onClick={() => navigate("/login-hotel")}
          >
            🏨 فندق
          </button>
          <button 
            type="button" 
            className="btn switcher-btn delivery-btn" 
            onClick={() => navigate("/login-delivery")}
          >
            🚚 توصيل
          </button>
        </div>
      </div>
      
      {/* 💅 CSS إضافي للأزرار الجديدة */}
      <style>{`
        /* ... (CSS الحالي للصفحة يبقى كما هو) ... */
        
        .role-switcher {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          text-align: center;
        }
        .role-switcher p {
          margin-bottom: 10px;
          font-size: 14px;
          color: #666;
        }
        .switcher-btn {
          padding: 8px 15px;
          margin: 0 5px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.3s;
        }
        .hotel-btn {
          background-color: #ffc107;
          color: #333;
        }
        .hotel-btn:hover {
          background-color: #e0a800;
        }
        .delivery-btn {
          background-color: #28a745;
          color: white;
        }
        .delivery-btn:hover {
          background-color: #1e7e34;
        }
        .login-button {
            /* تأكد من إضافة تصميم زر تسجيل الدخول الأساسي هنا أو في ملف CSS خارجي */
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 15px;
        }
      `}</style>
    </div>
  );
}