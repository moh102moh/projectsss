// src/components/LoginDelivery.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginDelivery() {
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
        alert(data.message || "❌ خطأ في تسجيل الدخول");
        return;
      }

      // ✅ تخزين التوكن
      localStorage.setItem("token", data.token);

      // ✅ التحقق من الدور والتوجيه إلى لوحة تحكم التوصيل
      if (data.user.role === "delivery") {
        localStorage.setItem("role", "delivery"); // تثبيت الدور لـ PrivateRoute
        navigate("/dashboard/drivers"); 
      } else {
        alert("🚫 غير مصرح لك بالدخول إلى لوحة التوصيل!");
        localStorage.removeItem("token");
        navigate("/login"); 
      }
    } catch (err) {
      console.error(err);
      alert("❌ خطأ في الاتصال بالسيرفر");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h2>تسجيل الدخول (التوصيل 🚚)</h2>

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

          <button type="submit" className="login-button delivery-login-btn">تسجيل الدخول</button>
        </form>

        {/* 👇 أزرار التنقل إلى الأدوار الأخرى */}
        <div className="role-switcher">
          <p>أو سجل الدخول كـ:</p>
          <button 
            type="button" 
            className="btn switcher-btn admin-btn" 
            onClick={() => navigate("/login")} // توجيه لصفحة الـ Admin/الاختيار
          >
            👑 إداري (Admin)
          </button>
          <button 
            type="button" 
            className="btn switcher-btn hotel-btn" 
            onClick={() => navigate("/login-hotel")} // توجيه لصفحة الفندق
          >
            🏨 فندق (Hotel)
          </button>
        </div>
      </div>

      {/* 💅 CSS للتنسيق الجذاب والمطابق */}
      <style>{`
        .login-page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f0f2f5;
          font-family: Arial, sans-serif;
        }

        .login-card {
          background: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .login-card h2 {
          margin-bottom: 25px;
          color: #333;
          border-bottom: 2px solid #28a745; /* لون مميز للتوصيل */
          padding-bottom: 10px;
          display: inline-block;
        }

        .login-form {
          text-align: right;
          width: 100%;
        }

        .form-group {
          margin-bottom: 20px;
          text-align: right;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #555;
        }

        .login-form input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-sizing: border-box;
        }

        .login-button.delivery-login-btn {
          width: 100%;
          padding: 12px;
          background-color: #28a745; /* لون التوصيل */
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 15px;
          transition: background-color 0.3s;
        }
        
        .login-button.delivery-login-btn:hover {
          background-color: #1e7e34;
        }
        
        /* تنسيق أزرار تبديل الأدوار (مشترك) */
        .role-switcher {
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px dashed #ddd;
          text-align: center;
        }
        .role-switcher p {
          margin-bottom: 15px;
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
        .admin-btn {
          background-color: #007bff;
          color: white;
        }
        .admin-btn:hover {
          background-color: #0056b3;
        }
        .hotel-btn {
          background-color: #ffc107;
          color: #333;
        }
        .hotel-btn:hover {
          background-color: #e0a800;
        }
      `}</style>
    </div>
  );
}